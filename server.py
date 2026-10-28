
import os
import gc
import base64
import threading
from io import BytesIO

# Set environment variables BEFORE importing TensorFlow.
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow import keras

app = Flask(__name__)

# Limit the size of incoming JSON requests to 12 MB.
app.config["MAX_CONTENT_LENGTH"] = 12 * 1024 * 1024

ALLOWED_ORIGINS = [
    "https://crop-disease-detection-beta.vercel.app",
    "https://crop-disease-detection-5qe79bpq6-omkarshindedsworks-projects.vercel.app",
    "https://crop-disease-detection-eight-wine.vercel.app",
    "https://crop-disease-detection-mxh4vh12o-omkarshindedsworks-projects.vercel.app",
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

# Set TensorFlow threading limits.
try:
    tf.config.threading.set_intra_op_parallelism_threads(1)
    tf.config.threading.set_inter_op_parallelism_threads(1)
except RuntimeError:
    app.logger.warning("TensorFlow threading was already initialized.")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "public", "models")

MODEL_FILES = {
    "rice": os.path.join(MODEL_DIR, "rice_models.keras"),
    "wheat": os.path.join(MODEL_DIR, "wheat_densenet_finetuned.h5"),
    "potato": os.path.join(MODEL_DIR, "potato_disease_model.h5"),
}

MODEL_TYPES = {
    "rice": "efficientnet",
    "wheat": "densenet",
    "potato": "efficientnet",
}

# Keep only one crop model loaded at a time.
_current_model = None
_current_crop = None
_model_lock = threading.Lock()


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "AgroAI Crop Disease Detection API",
        "prediction_endpoint": "/predict",
        "health_endpoint": "/health",
    }), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "loaded_crop": _current_crop,
    }), 200


def get_model(crop):
    """Load the requested model, unloading the previous crop model."""
    global _current_model, _current_crop

    with _model_lock:
        if _current_model is not None and _current_crop == crop:
            return _current_model

        # Release the previously loaded model before loading another.
        if _current_model is not None:
            del _current_model
            _current_model = None
            _current_crop = None
            keras.backend.clear_session()
            gc.collect()

        model_path = MODEL_FILES[crop]

        if not os.path.isfile(model_path):
            raise FileNotFoundError(
                f"Model file not found for {crop}: {model_path}"
            )

        app.logger.info("Loading model for crop: %s", crop)

        _current_model = keras.models.load_model(
            model_path,
            compile=False,
        )
        _current_crop = crop

        app.logger.info("Model loaded successfully: %s", crop)

        return _current_model


def preprocess_image(image_data, model_type):
    if not isinstance(image_data, str) or "," not in image_data:
        raise ValueError("Expected an image data URL in base64 format.")

    try:
        image_bytes = base64.b64decode(
            image_data.split(",", 1)[1],
            validate=True,
        )

        with Image.open(BytesIO(image_bytes)) as image:
            img = image.convert("RGB").resize((224, 224))
            img_array = np.asarray(img, dtype=np.float32)

    except Exception as exc:
        raise ValueError(f"Could not decode image: {exc}") from exc

    if model_type == "efficientnet":
        from tensorflow.keras.applications.efficientnet import preprocess_input
    elif model_type == "densenet":
        from tensorflow.keras.applications.densenet import preprocess_input
    elif model_type == "mobilenet":
        from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
    else:
        raise ValueError(f"Unsupported model type: {model_type}")

    img_array = preprocess_input(img_array)
    return np.expand_dims(img_array, axis=0)


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json(silent=True)

        if not isinstance(data, dict):
            return jsonify({"error": "A valid JSON object is required."}), 400

        crop = str(data.get("crop", "")).strip().lower()
        image_data = data.get("image")

        if crop not in MODEL_FILES:
            return jsonify({
                "error": "Invalid crop. Choose rice, wheat, or potato."
            }), 400

        if not image_data:
            return jsonify({"error": "Missing image field."}), 400

        app.logger.info("Prediction requested for crop: %s", crop)

        # Serialize model switching and inference to avoid concurrent
        # requests using a model while it is being unloaded.
        with _model_lock:
            model = get_model(crop)
            img_array = preprocess_image(
                image_data,
                MODEL_TYPES[crop],
            )

            # Direct model invocation avoids the predict() data adapter.
            output = model(img_array, training=False)
            predictions = np.asarray(output)[0]

        predicted_class = int(np.argmax(predictions))
        confidence = float(predictions[predicted_class] * 100)
        all_probs = [float(p * 100) for p in predictions]

        app.logger.info(
            "Prediction completed: crop=%s, class=%d, confidence=%.2f%%",
            crop,
            predicted_class,
            confidence,
        )

        return jsonify({
            "predicted_class": predicted_class,
            "confidence": confidence,
            "all_probabilities": all_probs,
        }), 200

    except Exception as exc:
        app.logger.exception("Prediction failed")
        return jsonify({"error": str(exc)}), 500


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({
        "error": "Image request is too large. Please upload a smaller image."
    }), 413


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False,
    )
