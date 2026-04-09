import React from 'react';
import { motion } from 'motion/react';
import { Download, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const Result = ({ resultUrl, error }) => {
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-10 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 h-full"
      >
        <div className="bg-rose-100 p-3 rounded-full mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold tracking-tight">Processing Failed</h3>
        <p className="text-xs text-center mt-2 opacity-80 leading-relaxed max-w-[200px]">{error}</p>
      </motion.div>
    );
  }

  if (!resultUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `studio-pro-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-10 h-full"
    >
      <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold uppercase tracking-widest border border-emerald-100 shadow-sm">
        <CheckCircle className="w-4 h-4" />
        <span>Processing Complete</span>
      </div>
      
      <div className="relative group flex-1 flex items-center justify-center w-full bg-checkerboard rounded-2xl border border-slate-100 p-6 shadow-inner">
        <img
          src={resultUrl}
          alt="Result"
          className="max-w-full max-h-[400px] rounded-lg shadow-2xl relative z-10"
          referrerPolicy="no-referrer"
        />
        <button 
          onClick={() => window.open(resultUrl, '_blank')}
          className="absolute top-4 right-4 z-20 bg-white p-2.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 border border-slate-100"
        >
          <ExternalLink className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="w-full pt-6 border-t border-slate-50">
        <motion.button
          initial={{ backgroundColor: '#10b981' }}
          whileHover={{ scale: 1.02, backgroundColor: '#059669' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          className="flex items-center justify-center gap-3 w-full py-5 px-8 bg-emerald-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-100"
        >
          <Download className="w-5 h-5" />
          <span>Download Image</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Result;