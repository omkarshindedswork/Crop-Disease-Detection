from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow import keras
import base64
from io import BytesIO
from PIL import Image
import os

# Optional: reduce TensorFlow warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

app = Flask(__name__)
CORS(app)

# -------------------- API STATUS ROUTES --------------------
@app.route("/", methods=["GET"])
def home():
    """Confirm that the AgroAI API is running."""
    return jsonify({
        "status": "running",
        "message": "AgroAI Crop Disease Detection API",
        "prediction_endpoint": "/predict",
        "health_endpoint": "/health"
    }), 200


@app.route("/health", methods=["GET"])
def health():
    """Simple health check for deployment monitoring."""
    return jsonify({"status": "ok"}), 200

# -------------------- LOAD MODELS --------------------
models = {}

try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    models = {
        'rice': keras.models.load_model(os.path.join(BASE_DIR, 'public/models/rice_models.keras')),
        'wheat': keras.models.load_model(os.path.join(BASE_DIR, 'public/models/wheat_densenet_finetuned.h5')),
        'potato': keras.models.load_model(os.path.join(BASE_DIR, 'public/models/potato_disease_model.h5.keras'))
    }

    print("✅ Models loaded successfully")

except Exception as e:
    print("❌ Error loading models:", str(e))


# 🔥 Model type mapping (VERY IMPORTANT)
model_types = {
    'rice': 'efficientnet',
    'wheat': 'densenet',
    'potato': 'efficientnet'
}


# -------------------- PREPROCESS FUNCTION --------------------
def preprocess_image(image_data, model_type):
    try:
        # Validate Base64 format
        if ',' not in image_data:
            raise ValueError("Invalid image format")

        # Decode image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        img = Image.open(BytesIO(image_bytes))

        # Convert to RGB
        img = img.convert('RGB')

        # Resize
        img = img.resize((224, 224))

        # Convert to array
        img_array = np.array(img)

        # 🔥 Dynamic preprocessing
        if model_type == "efficientnet":
            from tensorflow.keras.applications.efficientnet import preprocess_input
        elif model_type == "densenet":
            from tensorflow.keras.applications.densenet import preprocess_input
        elif model_type == "mobilenet":
            from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
        else:
            raise ValueError("Unsupported model type")

        img_array = preprocess_input(img_array)

        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)

        return img_array

    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")


# -------------------- PREDICT ROUTE --------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("\n📥 DATA RECEIVED:", data)

        # -------- Validation --------
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400

        if 'crop' not in data:
            return jsonify({'error': 'Missing crop field'}), 400

        if 'image' not in data:
            return jsonify({'error': 'Missing image field'}), 400

        crop = data['crop']
        image_data = data['image']

        print("🌾 Crop:", crop)

        # Validate crop
        if crop not in ['rice', 'wheat', 'potato']:
            return jsonify({'error': f'Invalid crop: {crop}'}), 400

        # 🔥 Get correct model + preprocessing
        model = models.get(crop)
        model_type = model_types.get(crop)

        if model is None:
            return jsonify({'error': f'Model not loaded for {crop}. Check the Render deployment logs and model file paths.'}), 500

        # -------- Preprocessing --------
        img_array = preprocess_image(image_data, model_type)

        # -------- Prediction --------
        predictions = model.predict(img_array)[0]

        predicted_class = int(np.argmax(predictions))
        confidence = float(predictions[predicted_class] * 100)

        all_probs = [float(p * 100) for p in predictions]

        print("✅ Prediction:", predicted_class, confidence)

        # -------- Response --------
        return jsonify({
            'predicted_class': predicted_class,
            'confidence': confidence,
            'all_probabilities': all_probs
        })

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({'error': str(e)}), 500


# -------------------- RUN SERVER --------------------
if __name__ == '__main__':
    app.run(port=5000, debug=True)
