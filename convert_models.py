"""
Convert Keras/H5 models to TensorFlow.js format for browser deployment

This script converts your trained models to a format that can be loaded
directly in the browser using TensorFlow.js.

Requirements:
    pip install tensorflowjs tensorflow

Usage:
    python convert_models.py

Output:
    Creates converted models in public/models/ directory
"""

import os
import tensorflowjs as tfjs
from tensorflow import keras

# Model file paths (update if your paths are different)
MODEL_FILES = {
    'rice': 'rice_models.keras',
    'wheat': 'wheat_model.h5',
    'potato': 'potato_disease_model.h5'
}

# Output directory
OUTPUT_DIR = 'public/models'

def convert_model(model_path, output_path, model_name):
    """Convert a single Keras model to TensorFlow.js format"""
    print(f"\n{'='*60}")
    print(f"Converting {model_name} model...")
    print(f"Input: {model_path}")
    print(f"Output: {output_path}")
    print(f"{'='*60}")
    
    try:
        # Load the Keras model
        print("Loading Keras model...")
        model = keras.models.load_model(model_path)
        
        # Print model summary
        print("\nModel Summary:")
        model.summary()
        
        # Convert to TensorFlow.js format
        print(f"\nConverting to TensorFlow.js format...")
        tfjs.converters.save_keras_model(model, output_path)
        
        print(f"✅ Successfully converted {model_name} model!")
        print(f"   Output files created in: {output_path}/")
        
        return True
        
    except Exception as e:
        print(f"❌ Error converting {model_name} model:")
        print(f"   {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("  KERAS TO TENSORFLOW.JS MODEL CONVERTER")
    print("  AgroAI Crop Disease Prediction System")
    print("="*60)
    
    # Check if models directory exists
    if not os.path.exists(OUTPUT_DIR):
        print(f"\n❌ Error: {OUTPUT_DIR} directory not found!")
        print("   Please create the public/models/ directory first.")
        return
    
    # Track conversion results
    results = {}
    
    # Convert each model
    for crop, filename in MODEL_FILES.items():
        model_path = os.path.join(OUTPUT_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, crop)
        
        # Check if model file exists
        if not os.path.exists(model_path):
            print(f"\n⚠️  Warning: {filename} not found in {OUTPUT_DIR}/")
            print(f"   Skipping {crop} model conversion.")
            results[crop] = False
            continue
        
        # Convert the model
        results[crop] = convert_model(model_path, output_path, crop.capitalize())
    
    # Print summary
    print("\n" + "="*60)
    print("  CONVERSION SUMMARY")
    print("="*60)
    
    for crop, success in results.items():
        status = "✅ Success" if success else "❌ Failed"
        print(f"{crop.capitalize():10} : {status}")
    
    successful = sum(results.values())
    total = len(results)
    
    print(f"\nTotal: {successful}/{total} models converted successfully")
    
    if successful == total:
        print("\n🎉 All models converted successfully!")
        print("\nNext steps:")
        print("1. The original .h5/.keras files are still in public/models/")
        print("2. You can delete them to save space (optional)")
        print("3. Run 'npm run dev' to start the application")
        print("4. The app will now load models from:")
        print("   - public/models/rice/model.json")
        print("   - public/models/wheat/model.json")
        print("   - public/models/potato/model.json")
    else:
        print("\n⚠️  Some models failed to convert.")
        print("   Please check the error messages above.")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    main()
