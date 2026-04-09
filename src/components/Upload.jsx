import React from 'react';
import { motion } from 'motion/react';
import { Upload as UploadIcon, Image as ImageIcon, Plus } from 'lucide-react';

const Upload = ({ onFileSelect, previewUrl }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!previewUrl ? (
        <motion.label 
          initial={{ borderColor: '#e2e8f0' }}
          whileHover={{ scale: 1.005, borderColor: '#4f46e5' }}
          whileTap={{ scale: 0.995 }}
          className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white hover:bg-slate-50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="bg-indigo-50 p-6 rounded-full mb-6 group-hover:bg-indigo-100 transition-colors">
            <UploadIcon className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload an image</h2>
          <p className="text-slate-500 mb-8">Drag and drop your image here, or click to browse</p>
          
          <div className="flex gap-3">
            {['PNG', 'JPG', 'WEBP'].map(format => (
              <span key={format} className="px-4 py-1.5 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {format}
              </span>
            ))}
          </div>
          
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </motion.label>
      ) : (
        <div className="flex justify-center">
          <motion.label 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer text-sm font-bold text-slate-700"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Change Image</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </motion.label>
        </div>
      )}
    </div>
  );
};

export default Upload;
