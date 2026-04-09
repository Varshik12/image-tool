# 🎨 Image-Tool - Modern Image Processing Suite

Imahe-Tool is a high-performance, aesthetically pleasing web application designed for seamless image manipulation. Built with a focus on user experience and speed, it combines a powerful Node.js backend with a fluid React frontend to provide professional-grade image editing tools directly in your browser.


## 🚀 Key Features

- **🔄 Smart Rotation**: Rotate your images to any specific angle with precision.
- **📏 Dynamic Resizing**: Scale images to your required dimensions instantly.
- **✂️ Interactive Cropping**: A visual, drag-and-drop cropping tool that lets you select exactly what you want to keep.
- **♻️ Format Conversion**: Effortlessly switch between PNG and JPG formats while maintaining quality.
- **⚡ Real-time Preview**: See your changes as you make them with our high-fidelity preview system.
- **🛡️ Hybrid Processing**: Uses a powerful Sharp-based backend for heavy tasks with local Canvas fallbacks for maximum reliability.

## 🛠️ Tech Stack
### Frontend
- **React 19**: Leveraging the latest React features for a high-performance UI.
- **Vite 6**: The next-generation frontend tooling.
- **Framer Motion**: Industry-standard animation library for fluid interactions.
- **Lucide React**: Comprehensive icon set for a clean UI.

## 📂 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Controls.jsx  # Operation selection & parameters
│   │   ├── Preview.jsx   # Interactive image preview & crop selection
│   │   ├── Result.jsx    # Final output display & download
│   │   └── Upload.jsx    # Drag-and-drop file uploader
│   ├── services/         # API integration logic
│   │   └── api.js        # Axios-based backend communication
│   ├── App.jsx           # Main application logic & state management
│   └── main.tsx          # Application entry point
├── server.js             # Express server with Sharp processing logic
├── package.json          # Project dependencies & scripts
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Image-Tool
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:3000`*

## 📖 How to Use

1. **Upload**: Drag and drop an image or click to browse.
2. **Select Action**: Choose from Rotate, Resize, Crop, or Convert in the control panel.
3. **Adjust**: Set your parameters (angle, dimensions, or crop area).
4. **Process**: Click "Apply Changes" to trigger the processing engine.
5. **Download**: Once finished, preview your result and download it instantly.

## 🛡️ Security & Performance

- **No-Referrer Policy**: All images are rendered with strict referrer policies for privacy.
- **Memory Efficient**: Blobs and Object URLs are properly revoked to prevent memory leaks.
- **Error Boundaries**: Robust error handling for both network and processing failures.

---

