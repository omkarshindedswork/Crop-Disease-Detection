import * as tf from '@tensorflow/tfjs';

// Model paths
const MODEL_PATHS = {
  wheat: '/models/wheat_densenet_finetuned.h5',
  rice: '/models/rice_models.keras',
  potato: '/models/potato_resnet50_final.keras'
};

// Disease class labels for each crop (in the order your models output them)
export const DISEASE_LABELS = {
  wheat: [
    'Aphid',
    'Black Rust',
    'Blast',
    'Brown Rust',
    'Fusarium Head Blight',
    'Healthy',
    'Leaf Blight',
    'Mildew',
    'Mite',
    'Septoria',
    'Smut',
    'Stem Fly',
    'Tan Spot',
    'Yellow Rust'
  ],
  rice: [
    'Bacterial Leaf Blight',
    'Brown Spot',
    'Healthy',
    'Leaf Blast',
    'Leaf Scald',
    'Narrow Brown Spot',
    'Neck Blast',
    'Rice Hispa',
    'Sheath Blight',
    'Tungro'
  ],
  potato: [
    'Early Blight',
    'Late Blight',
    'Healthy'
  ]
};

// Image preprocessing configuration
const IMAGE_SIZE = 224; // Standard input size for most CNN models

// Cache for loaded models
const modelCache = {};

/**
 * Load a trained model for the specified crop
 * @param {string} cropId - The crop identifier (wheat, rice, potato)
 * @returns {Promise<tf.LayersModel>} The loaded TensorFlow model
 */
export async function loadModel(cropId) {
  // Return cached model if already loaded
  if (modelCache[cropId]) {
    console.log(`Using cached model for ${cropId}`);
    return modelCache[cropId];
  }

  try {
    console.log(`Loading model for ${cropId}...`);
    const modelPath = MODEL_PATHS[cropId];
    
    // Load the model from the public folder
    const model = await tf.loadLayersModel(modelPath);
    
    // Cache the model for future use
    modelCache[cropId] = model;
    
    console.log(`Model loaded successfully for ${cropId}`);
    return model;
  } catch (error) {
    console.error(`Error loading model for ${cropId}:`, error);
    throw new Error(`Failed to load ${cropId} model. Please ensure the model file exists in public/models/`);
  }
}

/**
 * Preprocess image for model prediction
 * @param {HTMLImageElement} imageElement - The image element
 * @returns {tf.Tensor} Preprocessed image tensor
 */
export function preprocessImage(imageElement) {
  return tf.tidy(() => {
    // Convert image to tensor
    let tensor = tf.browser.fromPixels(imageElement);
    
    // Resize to model input size
    tensor = tf.image.resizeBilinear(tensor, [IMAGE_SIZE, IMAGE_SIZE]);
    
    // Normalize pixel values to [0, 1]
    tensor = tensor.div(255.0);
    
    // Add batch dimension
    tensor = tensor.expandDims(0);
    
    return tensor;
  });
}

/**
 * Predict disease from image
 * @param {string} cropId - The crop identifier
 * @param {HTMLImageElement} imageElement - The image element
 * @returns {Promise<Object>} Prediction result with disease and confidence
 */
export async function predictDisease(cropId, imageElement) {
  try {
    // Load the appropriate model
    const model = await loadModel(cropId);
    
    // Preprocess the image
    const processedImage = preprocessImage(imageElement);
    
    // Make prediction
    const prediction = await model.predict(processedImage);
    
    // Get prediction data
    const predictionData = await prediction.data();
    
    // Find the class with highest probability
    const maxProbability = Math.max(...predictionData);
    const predictedClassIndex = predictionData.indexOf(maxProbability);
    
    // Get disease labels for this crop
    const labels = DISEASE_LABELS[cropId];
    const predictedDisease = labels[predictedClassIndex];
    
    // Convert to percentage
    const confidence = Math.round(maxProbability * 100);
    
    // Clean up tensors
    processedImage.dispose();
    prediction.dispose();
    
    return {
      disease: predictedDisease,
      confidence: confidence,
      allProbabilities: Array.from(predictionData).map((prob, idx) => ({
        disease: labels[idx],
        probability: Math.round(prob * 100)
      }))
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
}

/**
 * Check if models are available
 * @returns {Promise<Object>} Status of each model
 */
export async function checkModelsAvailability() {
  const status = {};
  
  for (const [cropId, modelPath] of Object.entries(MODEL_PATHS)) {
    try {
      const response = await fetch(modelPath, { method: 'HEAD' });
      status[cropId] = response.ok;
    } catch (error) {
      status[cropId] = false;
    }
  }
  
  return status;
}

/**
 * Unload all cached models to free memory
 */
export function unloadModels() {
  Object.values(modelCache).forEach(model => {
    if (model && model.dispose) {
      model.dispose();
    }
  });
  Object.keys(modelCache).forEach(key => delete modelCache[key]);
  console.log('All models unloaded');
}

/**
 * Get disease-specific recommendations
 * @param {string} disease - The detected disease name
 * @param {string} crop - The crop type
 * @returns {string} Recommendation text
 */
export function getDiseaseRecommendation(disease, crop) {
  // Healthy crops
  if (disease === 'Healthy') {
    return 'Your crop looks healthy! Continue regular monitoring and maintenance. Ensure proper irrigation and nutrition.';
  }

  // Disease-specific recommendations
const recommendations = {
  // Wheat diseases and pests

  'Aphid': 'Monitor the crop regularly and watch pest and natural-enemy populations. Place 4–5 yellow/blue pan-water or sticky traps per acre, about 15 cm above the crop canopy. Grow about four rows of maize, sorghum, or bajra around the field as a barrier crop. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)',

  'Black Rust': 'Use resistant or tolerant wheat varieties, practice mixed cropping and crop rotation, and avoid excessive nitrogen fertilizer. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)',

  'Blast': 'Use healthy planting material, choose a suitable planting date, keep the field free of weeds, rotate wheat with non-host crops where possible, avoid excessive nitrogen fertilizer, and prefer resistant varieties. (Source: Wheat Improvement: Food Security in a Changing Climate, Springer/CIMMYT, 2022, Chapter 9, pages 146–147.)',

  'Brown Rust': 'Use resistant or tolerant wheat varieties, practice mixed cropping and crop rotation, and avoid excessive nitrogen fertilizer. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)',

  'Fusarium Head Blight': 'Grow wheat varieties with suitable resistance, use disease-free seed, manage infected crop residues, and rotate with non-host crops. Avoid maize–wheat rotation where Fusarium Head Blight is a serious problem. (Source: Wheat Improvement: Food Security in a Changing Climate, Springer/CIMMYT, 2022, Chapter 9, pages 145–146.)',

  'Leaf Blight': 'Use resistant varieties where available, use certified or healthy seed, sow at the recommended time, practice crop rotation, and consider barrier crops where appropriate. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 19, PDF page 31.)',

  'Mildew': 'Use resistant or tolerant wheat varieties. Ask your local ICAR institute, Krishi Vigyan Kendra (KVK), or State Agricultural University (SAU) about suitable varieties. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)',

  'Mite': 'Use neem oil 2% or NSKE 5%. Monitor the crop regularly and use chemical control only when necessary. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)',

  'Septoria': 'Use Septoria-resistant wheat varieties where suitable. Monitor the crop carefully after prolonged cool, wet weather and use an integrated disease-management approach. (Source: Wheat Improvement: Food Security in a Changing Climate, Springer/CIMMYT, 2022, Chapter 9, Section 9.4.4, pages 152–153.)',

  'Smut': 'Use disease-free seed. Remove plants showing yellowing of boot-leaf tips before ear emergence. Use disease-free fields for seed production. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 20, PDF page 32.)',

  'Stem Fly': 'Monitor the field regularly, plant maize, sorghum, or millet as barrier crops, and use fish-meal traps for monitoring. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30. The guide identifies this pest as Shoot Fly.)',

  'Shoot Fly': 'Monitor the field regularly, plant maize, sorghum, or millet as barrier crops, and use fish-meal traps for monitoring. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)',

  'Tan Spot': 'Prefer tan-spot-resistant wheat varieties. Manage tillage and water carefully, particularly in reduced-tillage or no-tillage systems. Use varieties with good genetic resistance for long-term protection. (Source: Wheat Improvement: Food Security in a Changing Climate, Springer/CIMMYT, 2022, Chapter 9, pages 149–150.)',

  'Yellow Rust': 'Use resistant or tolerant wheat varieties, practice mixed cropping and crop rotation, and avoid excessive nitrogen fertilizer. (Source: AESA based IPM – Wheat, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)',

  // Rice diseases and pests

  'Bacterial Leaf Blight': 'Reduce nitrogen fertilizer and, when needed, apply it in small split doses. Avoid field-to-field irrigation and monitor the crop regularly. (Source: Government of India, Ministry of Agriculture & Farmers Welfare, DPPQ&S, Advisory on Bacterial Leaf Blight in Rice in Odisha, 25 October 2018, pages 1–3.)',

  'Brown Spot': 'Use tolerant or resistant varieties and good-quality, disease-free seed. Maintain balanced soil fertility and proper water management, avoid crop stress, remove infected crop residues and weeds, and practice crop rotation. (Source: Upland Rice: A Global Perspective, P. C. Gupta and J. C. O’Toole, IRRI, 1986, Chapter 10, page 305 and pages 310–315.)',

  'Leaf Blast': 'Keep the field clean and remove infected seed, panicles, and crop debris after harvest. Use certified, disease-free seed and recommended seed treatment. Maintain proper water levels and monitor the crop during blast-favourable weather. (Source: Government of India, Ministry of Agriculture & Farmers Welfare, DPPQ&S, Advisory on Blast Disease in Rice, 22 July 2022, pages 1–5.)',

  'Leaf Scald': 'Use resistant or tolerant varieties where available, avoid excessive nitrogen, maintain balanced nutrition, remove infected crop residues, and use healthy or appropriately treated seed. (Source: Upland Rice: A Global Perspective, P. C. Gupta and J. C. O’Toole, IRRI, 1986, Chapter 10, page 306 and pages 310–315.)',

  'Narrow Brown Spot': 'Use less-susceptible or resistant varieties where available. Destroy infected plant debris, maintain field sanitation, use healthy or treated seed, and monitor the crop during later growth stages. (Source: Upland Rice: A Global Perspective, P. C. Gupta and J. C. O’Toole, IRRI, 1986, Chapter 10, page 307; KVK Anjaw, Rice Symptoms & Management, Narrow Brown Leaf Spot section.)',

  'Neck Blast': 'Use healthy, certified seed and recommended seed treatment. Keep the field clean, remove infected plant material, maintain proper water levels, avoid excessive nitrogen, and monitor the crop around reproductive stages. (Source: Government of India, Ministry of Agriculture & Farmers Welfare, DPPQ&S, Advisory on Blast Disease in Rice, 22 July 2022, Annexure I.)',

  'Rice Hispa': 'Monitor the crop regularly. Collect adult beetles using a sweep net and destroy them. Remove rice ratoons and volunteer rice plants during the crop-free period. Avoid nitrogen top-dressing during high pest incidence and conserve natural predators. (Source: Government of India, Ministry of Agriculture & Farmers Welfare, DPPQ&S, Advisory on Rice Hispa in Assam, 5 September 2018, pages 1–3.)',

  'Sheath Blight': 'Avoid excessive nitrogen and heavy manuring. Maintain appropriate plant spacing, remove infected crop residues, manage grasses and other host plants, and maintain sensible water management. (Source: Upland Rice: A Global Perspective, P. C. Gupta and J. C. O’Toole, IRRI, 1986, Chapter 10, page 306 and pages 310–315.)',

  'Tungro': 'Use varieties resistant to tungro or its green leafhopper vector where available. Synchronize planting with neighbouring farmers where practical, remove and destroy diseased plants, and remove volunteer rice plants and weeds after harvest. (Source: Upland Rice: A Global Perspective, P. C. Gupta and J. C. O’Toole, IRRI, 1986, Chapter 10, page 309; TNAU, Management of Diseases of Important Agriculture Crops of Tamil Nadu, pages 256–257.)',

  // Potato diseases

  'Early Blight': 'Follow cultural, mechanical, and biological integrated pest management practices. If chemical control is required, use a product currently approved for potato early blight according to its label and local agricultural advice. (Source: AESA based IPM – Potato, NIPHM/DPPQ&S, Government of India, 2014, printed page 17, PDF page 29.)',

  'Late Blight': 'Follow integrated pest management practices and use suitable short-duration varieties where appropriate. Monitor humidity and temperature conditions that favour late blight. If chemical control is required, use a currently approved product according to its label and local agricultural advice. (Source: AESA based IPM – Potato, NIPHM/DPPQ&S, Government of India, 2014, printed page 18, PDF page 30.)'
};

  return recommendations[disease] || 
    `Disease detected: ${disease}. Consult with a local agricultural expert for specific treatment recommendations. Consider applying appropriate fungicides and improving crop management practices.`;
}

