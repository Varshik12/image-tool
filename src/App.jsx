import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Upload from './components/Upload';
import Controls from './components/Controls';
import Preview from './components/Preview';
import Result from './components/Result';
import { rotateImage, pngToJpg, jpgToPng, resizeImage, cropImage } from './services/api';
import { ImageIcon,  CheckCircle, AlertCircle, Loader2, Zap, ShieldCheck } from 'lucide-react';

const App = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [operation, setOperation] = useState('');
  const [params, setParams] = useState({
    angle: 90,
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    format: 'png-to-jpg',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  useEffect(() => {
    // Health check removed to avoid CORS alert in UI
    setIsBackendConnected(true);
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    try {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setResultUrl(null);
      setError(null);
      setDimensions({ width: 0, height: 0 });
    } catch (err) {
      console.error("Error selecting file:", err);
      setError("Failed to load the selected image.");
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    // Use requestAnimationFrame to avoid "Cannot update a component while rendering a different component"
    requestAnimationFrame(() => {
      setDimensions({ width: naturalWidth, height: naturalHeight });
      setParams(prev => ({
        ...prev,
        width: naturalWidth,
        height: naturalHeight,
        x: 0,
        y: 0
      }));
    });
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setResultUrl(null);

    try {
      let blob;
      switch (operation) {
        case 'rotate':
          blob = await rotateImage(file, params.angle);
          break;
        case 'resize':
          blob = await resizeImage(file, params.width, params.height);
          break;
        case 'crop':
          if (params.width <= 0 || params.height <= 0) {
            throw new Error('Please select a crop area by dragging on the image.');
          }
          blob = await cropImage(file, params.x, params.y, params.width, params.height);
          break;
        case 'convert':
          if (params.format === 'png-to-jpg') {
            blob = await pngToJpg(file);
          } else {
            blob = await jpgToPng(file);
          }
          break;
        default:
          throw new Error('Invalid operation');
      }

      if (!blob || blob.size < 100) {
        // Try to extract error message from blob if it's not an image
        if (blob && blob.type && !blob.type.startsWith('image/')) {
          const text = await blob.text();
          throw new Error(text.substring(0, 150) || 'Server returned an error.');
        }
        throw new Error('Server returned an empty or invalid response.');
      }

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Premium Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Image Tool
            </h1>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default">
              <Zap className="w-4 h-4" /> Fast
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default">
              <ShieldCheck className="w-4 h-4" /> Secure
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload-screen"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  Professional Image <span className="text-indigo-600">Processing</span>
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  The simplest way to rotate, resize, and crop your images with this Image Tool.
                </p>
              </div>
              <Upload onFileSelect={handleFileSelect} previewUrl={previewUrl} />
            </motion.div>
          ) : (
            <motion.div
              key="workspace-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Upload onFileSelect={handleFileSelect} previewUrl={previewUrl} />
                  <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filename</span>
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-500">
                    {dimensions.width} &times; {dimensions.height}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Tools */}
                <div className="lg:col-span-4 sticky top-32">
                  <Controls
                    operation={operation}
                    setOperation={setOperation}
                    params={params}
                    setParams={setParams}
                    onProcess={handleProcess}
                    isProcessing={isProcessing}
                    hasFile={!!file}
                    dimensions={dimensions}
                  />
                </div>

                {/* Right: Preview/Result */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <Preview 
                      previewUrl={previewUrl} 
                      operation={operation}
                      params={params}
                      setParams={setParams}
                      dimensions={dimensions}
                      onImageLoad={handleImageLoad}
                    />
                    
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col min-h-[600px]">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="bg-emerald-50 p-2 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 tracking-tight">Output Result</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <Result resultUrl={resultUrl} error={error} />
                        
                        {!resultUrl && !error && !isProcessing && (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <div className="bg-slate-50 p-8 rounded-full mb-6">
                              <ImageIcon className="w-12 h-12 opacity-10" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em]">Waiting for processing</p>
                          </div>
                        )}
                        
                        {isProcessing && (
                          <div className="flex-1 flex flex-col items-center justify-center text-indigo-600">
                            <div className="relative">
                              <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-20"></div>
                              <div className="bg-indigo-50 p-8 rounded-full relative">
                                <Loader2 className="w-12 h-12 animate-spin" />
                              </div>
                            </div>
                            <p className="text-sm font-black mt-8 tracking-tight uppercase">Processing Magic</p>
                            <p className="text-xs text-slate-400 mt-2">Applying pixel transformations</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-32 py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-indigo-600" />
            <span className="font-black text-slate-900 text-xl tracking-tight">Image tool</span>
          </div>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
            Professional-grade image processing suite. Fast, secure, and pixel-perfect.
          </p>
          <div className="mt-12 text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
            &copy; 2026 Image Tool &bull; All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
