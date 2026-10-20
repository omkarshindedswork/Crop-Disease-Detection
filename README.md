# 🌾 AgroAI - Crop Disease Prediction System

![AgroAI Banner](https://img.shields.io/badge/AgroAI-Crop%20Disease%20Detection-16a34a?style=for-the-badge&logo=leaflet)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.2.10-646CFF?style=for-the-badge&logo=vite)

A modern, AI-powered crop disease detection system designed for farmers. Upload a crop leaf image and get instant disease predictions using machine learning.

## ✨ Features

- 🎯 **AI-Powered Detection** - Advanced machine learning for accurate disease identification
- 🌱 **Multiple Crops** - Support for Wheat, Rice, and Potato
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🎨 **Modern UI/UX** - Clean, professional design with smooth animations
- ⚡ **Fast & Intuitive** - Simple 3-step prediction process
- 🖼️ **Drag & Drop Upload** - Easy image uploading with preview
- 📊 **Detailed Results** - Confidence scores and recommendations

## 🚀 Demo Features

> **Note:** This is a demo version. The ML model is not yet integrated. The system generates random predictions for testing purposes.

### Prediction Logic (Demo Mode)
- Randomly selects a disease from the crop's disease list
- Generates confidence scores between 70% - 98%
- Displays results in a beautiful result card
- Provides recommendations based on the prediction

### Supported Crops & Diseases

#### 🌾 Wheat
- Healthy
- Rust Disease
- Leaf Blight

#### 🌾 Rice
- Healthy
- Brown Spot
- Leaf Blast

#### 🥔 Potato
- Healthy
- Early Blight
- Late Blight

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.2.10
- **Styling:** Tailwind CSS 3.4.3
- **Icons:** Lucide React
- **Animations:** CSS Animations + Framer Motion concepts
- **Language:** JavaScript (ES6+)

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Steps

1. **Extract the project files** (if provided as ZIP)

2. **Navigate to the project directory**
   ```bash
   cd agroai-crop-disease-prediction
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to the URL shown in terminal

## 🎯 Usage Guide

### For Users

1. **Select Your Crop**
   - Click on one of the three crop cards (Wheat, Rice, or Potato)
   - The selected card will highlight in green

2. **Upload Leaf Image**
   - Drag and drop an image into the upload area
   - Or click to browse and select an image
   - Image preview will be shown

3. **Get Prediction**
   - Click the "Predict Disease" button
   - Wait 2 seconds for AI analysis (simulated)
   - View results with confidence score and recommendations

4. **Understand Results**
   - Green = Healthy crop
   - Red = Disease detected
   - Follow the recommendations provided

### For Developers

#### Project Structure
```
agroai-crop-disease-prediction/
├── src/
│   ├── components/
│   │   └── (All components are in App.jsx for simplicity)
│   ├── App.jsx          # Main application with all components
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles + Tailwind
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

#### Component Architecture

**App.jsx** contains all components:
- `Navbar` - Sticky navigation with smooth scroll
- `Hero` - Landing section with CTA buttons
- `Predictor` - Main prediction interface (3 steps)
- `ResultCard` - Displays prediction results
- `About` - Information about AgroAI
- `Footer` - Footer section

#### Key Features in Code

**State Management:**
```javascript
const [selectedCrop, setSelectedCrop] = useState(null);
const [uploadedImage, setUploadedImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [result, setResult] = useState(null);
const [isLoading, setIsLoading] = useState(false);
```

**Random Prediction Logic:**
```javascript
const predictDisease = () => {
  // Simulates ML model prediction
  const crop = crops.find(c => c.id === selectedCrop);
  const randomDisease = crop.diseases[Math.floor(Math.random() * crop.diseases.length)];
  const confidence = Math.floor(Math.random() * (98 - 70 + 1)) + 70;
  
  const resultData = {
    crop: crop.name,
    prediction: randomDisease,
    confidence: confidence,
    isHealthy: randomDisease === 'Healthy',
    recommendation: /* ... */
  };
  
  setResult(resultData);
};
```

**Image Upload with Drag & Drop:**
```javascript
const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  handleImageUpload(file);
};
```

## 🎨 Design System

### Colors
- **Primary:** `#16a34a` (Green)
- **Secondary:** `#10b981` (Emerald)
- **Success:** `#22c55e` (Light Green)
- **Error:** `#ef4444` (Red)
- **Background:** Gradient from green-50 to emerald-50

### Typography
- **Font Family:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700, 800, 900

### Animations
- Blob animations in hero section
- Smooth fade-in and slide-in transitions
- Hover effects on all interactive elements
- Loading spinner during prediction

## 🔮 Future Enhancements

### Phase 1 - ML Integration
- [ ] Integrate TensorFlow.js or ONNX model
- [ ] Train custom CNN model on crop disease dataset
- [ ] Implement real-time inference
- [ ] Add model confidence thresholds

### Phase 2 - Features
- [ ] Add more crop types (Tomato, Corn, Cotton, etc.)
- [ ] Disease information database
- [ ] Treatment recommendations
- [ ] History of predictions
- [ ] Export reports as PDF

### Phase 3 - Advanced
- [ ] User authentication
- [ ] Dashboard for farmers
- [ ] Mobile app (React Native)
- [ ] Multilingual support
- [ ] Offline mode with PWA

## 🤝 Contributing

This is a student project. Contributions, issues, and feature requests are welcome!

### How to Contribute
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Known Issues

- ML model is not integrated (using random predictions)
- No backend API connection
- No data persistence
- Limited to 3 crop types

## 📄 License

This project is created for educational purposes. Free to use and modify.

## 👨‍💻 Author

**Student Project - 2026**

Built with ❤️ using React, Tailwind CSS, and modern web technologies.

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Inspiration from modern AI/ML product websites
- Agricultural domain knowledge for disease identification

---

### 📞 Support

If you have any questions or need help, please create an issue in the repository.

### ⭐ Show Your Support

If you found this project helpful, please give it a star!

---

**Made with 🌱 for farmers and agriculture innovation**
