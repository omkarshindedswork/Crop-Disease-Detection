from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow import keras
import base64
from io import BytesIO
from PIL import Image
import os

# Optional: reduce TensorFlow warnings
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

app = Flask(__name__)

# Allow requests from the deployed Vercel frontend domains.
# Add any other frontend domain here if you use one.
ALLOWED_ORIGINS = [
    "https://crop-disease-detection-beta.vercel.app",
    "https://crop-disease-detection-5qe79bpq6-omkarshindedsworks-projects.vercel.app",
]

CORS(
    app,
    resources={
        r"/*": {
            "origins": ALLOWED_ORIGINS,
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    },
)

# -------------------- API STATUS ROUTES --------------------
@app.route("/", methods=["GET"])
def home():
    """Confirm that the AgroAI API is running."""
    return jsonify({
        "status": "running",
        "message": "AgroAI Crop Disease Detection API",
        "prediction_endpoint": "/predict",
        "health_endpoint": "/health",
    }), 200


@app.route("/health", methods=["GET"])
def health():
    """Simple health check for deployment monitoring."""
    return jsonify({"status": "ok"}), 200


# -------------------- LOAD MODELS --------------------
models = {}

try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(BASE_DIR, "public", "models")

    models = {
        "rice": keras.models.load_model(
            os.path.join(model_dir, "rice_models.keras")
        ),
        "wheat": keras.models.load_model(
            os.path.join(model_dir, "wheat_densenet_finetuned.h5")
        ),
        "potato": keras.models.load_model(
            os.path.join(model_dir, "potato_disease_model.h5")
        ),
    }

    print("Models loaded successfully")

except Exception as e:
    # Preserve the exception in Render logs for troubleshooting.
    print("Error loading models:", str(e))


# Model type mapping
model_types = {
    "rice": "efficientnet",
    "wheat": "densenet",
    "potato": "efficientnet",
}


# -------------------- PREPROCESS FUNCTION --------------------
def preprocess_image(image_data, model_type):
    try:
        if not isinstance(image_data, str) or "," not in image_data:
            raise ValueError("Invalid image format; expected a base64 data URL")

        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(",", 1)[1])
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))

        img_array = np.array(img)

        if model_type == "efficientnet":
            from tensorflow.keras.applications.efficientnet import preprocess_input
        elif model_type == "densenet":
            from tensorflow.keras.applications.densenet import preprocess_input
        elif model_type == "mobilenet":
            from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
        else:
            raise ValueError(f"Unsupported model type: {model_type}")

        img_array = preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)

        return img_array

    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}") from e


# -------------------- PREDICT ROUTE --------------------
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    # Flask-CORS handles the browser's OPTIONS preflight request.
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True)
        print("Prediction request received")

        if not data:
            return jsonify({"error": "No valid JSON data received"}), 400

        if "crop" not in data:
            return jsonify({"error": "Missing crop field"}), 400

        if "image" not in data:
            return jsonify({"error": "Missing image field"}), 400

        crop = str(data["crop"]).strip().lower()
        image_data = data["image"]

        if crop not in ["rice", "wheat", "potato"]:
            return jsonify({"error": f"Invalid crop: {crop}"}), 400

        model = models.get(crop)
        model_type = model_types.get(crop)

        if model is None:
            return jsonify({
                "error": (
                    f"Model not loaded for {crop}. "
                    "Check the Render deployment logs and model file paths."
                )
            }), 500

        img_array = preprocess_image(image_data, model_type)
        predictions = model.predict(img_array, verbose=0)[0]

        predicted_class = int(np.argmax(predictions))
        confidence = float(predictions[predicted_class] * 100)
        all_probs = [float(p * 100) for p in predictions]

        print(
            f"Prediction completed: crop={crop}, "
            f"class={predicted_class}, confidence={confidence:.2f}%"
        )

        return jsonify({
            "predicted_class": predicted_class,
            "confidence": confidence,
            "all_probabilities": all_probs,
        }), 200

    except Exception as e:
        app.logger.exception("Prediction failed")
        return jsonify({"error": str(e)}), 500


# -------------------- RUN SERVER --------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
