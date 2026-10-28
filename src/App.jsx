import React, { useState, useEffect } from 'react';
import { Menu, X, Upload, Leaf, TrendingUp, CheckCircle, AlertTriangle, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { DISEASE_LABELS, getDiseaseRecommendation } from './modelLoader';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

// ==================== NAVBAR COMPONENT ====================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl transform group-hover:rotate-12 transition-transform duration-300">
                <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AgroAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {['Home', 'Predict', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="px-5 py-2.5 text-gray-700 hover:text-green-600 font-medium rounded-lg hover:bg-green-50 transition-all duration-200"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('predict')}
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-2">
            {['Home', 'Predict', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('predict')}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// ==================== HERO COMPONENT ====================
const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-700">AI-Powered Agriculture</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI Powered
          </span>
          <br />
          <span className="text-gray-800">Crop Disease Detection</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Upload a crop leaf image and detect diseases instantly using advanced AI technology. 
          <span className="text-green-600 font-semibold"> Early detection, better harvest.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <button
            onClick={() => document.getElementById('predict')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
          >
            <span>Start Prediction</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
          {[
            { label: 'Accuracy Rate', value: '95%', icon: TrendingUp },
            { label: 'Crops Supported', value: '3+', icon: Leaf },
            { label: 'Disease Detection', value: 'Instant', icon: Sparkles }
          ].map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PREDICTOR COMPONENT ====================
const Predictor = ({ setResult }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const crops = [
    { id: 'wheat', name: 'Wheat', emoji: '🌾', diseases: DISEASE_LABELS.wheat },
    { id: 'rice', name: 'Rice', emoji: '🌾', diseases: DISEASE_LABELS.rice },
    { id: 'potato', name: 'Potato', emoji: '🥔', diseases: DISEASE_LABELS.potato }
  ];

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  const handlePredict = async () => {
    if (!selectedCrop || !uploadedImage) {
      alert('Please select a crop and upload an image first!');
      return;
    }

    if (!API_BASE_URL) {
      alert("Backend URL is missing. Set VITE_API_BASE_URL in Vercel and redeploy.");
      return;
    }

    setIsLoading(true);

    try {
      // Create an image element from the uploaded file
      const img = new Image();
      img.src = imagePreview;
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
                    "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop: selectedCrop,
          image: imagePreview, // Base64 string
  }),
});

      let prediction;
      try {
        prediction = await response.json();
      } catch {
        throw new Error("The backend returned an invalid response. Please check the Render logs.");
      }

      if (!response.ok) {
        throw new Error(prediction.error || `Prediction failed (HTTP ${response.status})`);
      }
      prediction.disease =
      DISEASE_LABELS[selectedCrop][prediction.predicted_class];

      prediction.allProbabilities =
      prediction.all_probabilities;

      // Get prediction from the ML model
    //  const prediction = await predictDisease(selectedCrop, img);
      
      const crop = crops.find(c => c.id === selectedCrop);
      
      const resultData = {
        crop: crop.name,
        prediction: prediction.disease,
        confidence: prediction.confidence,
        isHealthy: prediction.disease === 'Healthy',
        allProbabilities: prediction.allProbabilities,
        recommendation: getDiseaseRecommendation(prediction.disease, selectedCrop)
      };

      setResult(resultData);
      setIsLoading(false);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Prediction error:', error);
      setIsLoading(false);
      
      // Show error message
      const message = error?.message || "Unknown error";
      const isNetworkError =
        error instanceof TypeError ||
        message.toLowerCase().includes("fetch");

      alert(
        isNetworkError
          ? `Could not connect to the AgroAI backend at ${API_BASE_URL}. Check that the Render service is live, VITE_API_BASE_URL is set in Vercel, and the backend allows requests from this site.`
          : message
      );
    }
  };

  return (
    <section id="predict" className="py-24 bg-gradient-to-br from-gray-50 to-green-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Detect <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Crop Diseases</span>
          </h2>
          <p className="text-lg text-gray-600">Follow these simple steps to analyze your crop health</p>
        </div>

        {/* Prediction Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Step 1: Select Crop */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 text-green-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Select Your Crop</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedCrop === crop.id
                      ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/30'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-5xl mb-3">{crop.emoji}</div>
                  <div className="text-lg font-bold text-gray-900">{crop.name}</div>
                  {selectedCrop === crop.id && (
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Upload Image */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 text-green-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Upload Leaf Image</h3>
            </div>

            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drag & drop your image here
                </p>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <div className="inline-block px-6 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                  Choose File
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                <img
                  src={imagePreview}
                  alt="Uploaded crop"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-semibold">✓ Image uploaded successfully</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Predict Button */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 text-green-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Get Results</h3>
            </div>
            <button
              onClick={handlePredict}
              disabled={isLoading || !selectedCrop || !uploadedImage}
              className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Predict Disease</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== RESULT CARD COMPONENT ====================
const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <section id="results" className="py-24 bg-gradient-to-br from-green-50/30 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-gradient-to-br ${
          result.isHealthy 
            ? 'from-green-50 to-emerald-50 border-green-200' 
            : 'from-red-50 to-orange-50 border-red-200'
        } border-2 rounded-3xl shadow-2xl p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              result.isHealthy ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {result.isHealthy ? (
                <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
              ) : (
                <AlertTriangle className="w-12 h-12 text-white" strokeWidth={2.5} />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Analysis Complete
            </h2>
            <p className="text-gray-600">AI-powered disease detection results</p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-sm font-semibold text-gray-500 mb-2">CROP TYPE</div>
              <div className="text-2xl font-bold text-gray-900">{result.crop}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-sm font-semibold text-gray-500 mb-2">CONFIDENCE</div>
              <div className="text-2xl font-bold text-gray-900">{result.confidence}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    result.isHealthy ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Prediction */}
          <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
            <div className="text-sm font-semibold text-gray-500 mb-3">PREDICTION</div>
            <div className={`text-3xl sm:text-4xl font-bold mb-4 ${
              result.isHealthy ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.prediction}
            </div>
            <div className="text-gray-700 leading-relaxed">
              {result.isHealthy ? (
                <p>Great news! No disease detected in your crop. The plant appears to be in good health.</p>
              ) : (
                <p>Disease detected in your crop. Immediate action is recommended to prevent further spread.</p>
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className={`rounded-2xl p-6 ${
            result.isHealthy ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'
          }`}>
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${result.isHealthy ? 'bg-green-500' : 'bg-red-500'}`}>
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-2 text-lg">Recommendation</div>
                <p className="text-gray-700 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== ABOUT COMPONENT ====================
const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms analyze crop images to detect diseases with high accuracy.'
    },
    {
      icon: TrendingUp,
      title: 'Early Detection',
      description: 'Identify diseases in early stages to prevent crop loss and improve overall yield.'
    },
    {
      icon: Leaf,
      title: 'Multiple Crops',
      description: 'Support for various crops including wheat, rice, and potato with expanding database.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">AgroAI</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AgroAI is an AI-based system designed to help farmers detect crop diseases early using leaf images. 
            Early detection helps reduce crop loss and improve yield, empowering farmers with technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Leaf className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto opacity-95">
            To empower farmers worldwide with cutting-edge AI technology, making crop disease detection 
            accessible, accurate, and instant. Together, we're building a sustainable future for agriculture.
          </p>
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER COMPONENT ====================
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl">
              <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold">AgroAI</span>
          </div>

          {/* Info */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 mb-2">
              <span className="font-semibold text-white">AgroAI</span> – Student Project
            </p>
            <p className="text-gray-500 text-sm">
              © 2026 All rights reserved. Built with React & Tailwind CSS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Empowering farmers with AI technology for a sustainable future 🌱
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==================== MAIN APP COMPONENT ====================
export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: in 0.6s ease-out forwards;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>

      <Navbar />
      <Hero />
      <Predictor setResult={setResult} />
      {result && <ResultCard result={result} />}
      <About />
      <Footer />
    </div>
  );
}
