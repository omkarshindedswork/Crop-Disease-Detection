# 🚀 Quick Start Guide - AgroAI

Get your AgroAI website up and running in 5 minutes!

## ⚡ Super Fast Setup

### Step 1: Install Node.js (if not already installed)
Download from: https://nodejs.org/ (Get the LTS version)

### Step 2: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 3: Navigate to Project Folder
```bash
cd path/to/agroai-crop-disease-prediction
```

### Step 4: Install Dependencies
```bash
npm install
```
⏱️ This will take 1-2 minutes. Wait for it to complete.

### Step 5: Start the Application
```bash
npm run dev
```

### Step 6: Open Your Browser
The website will automatically open at: **http://localhost:3000**

If it doesn't open automatically, copy this URL and paste it in your browser.

## ✅ That's It!

Your AgroAI website is now running! 🎉

## 🎯 Testing the Website

1. **Click "Start Prediction"** or scroll down
2. **Select a crop** (Wheat, Rice, or Potato)
3. **Upload any image** (use any crop/leaf image you have)
4. **Click "Predict Disease"**
5. **View the results** (randomly generated for demo)

## 🛑 Stopping the Server

In the terminal, press: `Ctrl + C`

## 🔄 Running Again

Just run: `npm run dev`

## 📦 Building for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

## 🆘 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Problem: Port 3000 is already in use
**Solution:** The app will automatically use port 3001, 3002, etc.

### Problem: Dependencies not installing
**Solution:** 
```bash
# Delete node_modules and try again
rm -rf node_modules
npm install
```

### Problem: Blank white screen
**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run dev
```

## 💡 Tips

- Use **Google Chrome** or **Firefox** for best experience
- Test on mobile by opening `http://your-ip-address:3000` on your phone
- Press `F12` in browser to open Developer Tools if something goes wrong

## 🎨 Customization

Want to change colors, text, or add features?
- All code is in `src/App.jsx`
- Colors can be changed in the gradient classes
- Disease list is in the `crops` array

## 📱 Accessing from Phone

1. Find your computer's IP address:
   - Windows: `ipconfig` in cmd
   - Mac/Linux: `ifconfig` in terminal

2. On your phone's browser, go to:
   ```
   http://YOUR-IP-ADDRESS:3000
   ```

Example: `http://192.168.1.5:3000`

## 🎓 Learning Resources

- React: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Vite: https://vitejs.dev/

---

**Need Help?** Create an issue or check the README.md for detailed documentation.

**Happy Coding! 🌱**
