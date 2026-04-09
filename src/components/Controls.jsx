import React from 'react';
import { motion } from 'motion/react';
import { RotateCw, Maximize, Crop, RefreshCw, Loader2, ChevronRight, Layers } from 'lucide-react';

const Controls = ({ operation, setOperation, params, setParams, onProcess, isProcessing, hasFile, dimensions }) => {
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['angle', 'width', 'height', 'x', 'y'];
    const newValue = numericFields.includes(name) ? (parseInt(value) || 0) : value;
    setParams((prev) => ({ ...prev, [name]: newValue }));
  };

  const operations = [
    { id: 'rotate', label: 'Rotate', icon: RotateCw },
    { id: 'resize', label: 'Resize', icon: Maximize },
    { id: 'crop', label: 'Crop', icon: Crop },
    { id: 'convert', label: 'Convert', icon: RefreshCw },
  ];

  const renderInputs = () => {
    switch (operation) {
      case 'rotate':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Rotation Angle</label>
              <div className="relative">
                <input
                  type="number"
                  name="angle"
                  value={params.angle}
                  onChange={handleParamChange}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="90"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold">DEG</span>
              </div>
            </div>
          </motion.div>
        );
      case 'resize':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Width</label>
                <input
                  type="number"
                  name="width"
                  value={params.width}
                  onChange={handleParamChange}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Height</label>
                <input
                  type="number"
                  name="height"
                  value={params.height}
                  onChange={handleParamChange}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Size</span>
                <span className="text-xs font-bold text-slate-600">{dimensions.width} &times; {dimensions.height}</span>
              </div>
            </div>
          </motion.div>
        );
      case 'crop':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <Crop className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Interactive Selection</span>
              </div>
              <p className="text-xs leading-relaxed text-indigo-600/80">
                Draw a rectangle on the preview image to select the crop area.
              </p>
            </div>
            {params.width > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Current Selection</span>
                  <button
                    onClick={() => setParams(prev => ({ ...prev, x: 0, y: 0, width: dimensions.width, height: dimensions.height }))}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
                  >
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Width</span>
                    <span className="text-sm font-bold text-slate-700">{params.width}px</span>
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Height</span>
                    <span className="text-sm font-bold text-slate-700">{params.height}px</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 'convert':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Target Format</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'png-to-jpg', label: 'PNG to JPG', desc: 'Optimized for web' },
                { id: 'jpg-to-png', label: 'JPG to PNG', desc: 'Lossless conversion' }
              ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setParams(prev => ({ ...prev, format: opt.id }))}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                    params.format === opt.id 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${params.format === opt.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-0.5">{opt.desc}</span>
                  </div>
                  {params.format === opt.id && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <Layers className="w-16 h-16 mb-6 opacity-10" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Select a tool to begin</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col gap-10 h-full">
      <div className="space-y-4">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tools</label>
        <div className="grid grid-cols-2 gap-3">
          {operations.map((op) => {
            const Icon = op.icon;
            return (
              <button
                key={op.id}
                onClick={() => setOperation(op.id)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                  operation === op.id
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm'
                    : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${operation === op.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold uppercase tracking-wider">{op.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        {renderInputs()}
      </div>

      <div className="pt-6 border-t border-slate-50">
        <motion.button
          initial={{ backgroundColor: '#4f46e5' }}
          whileHover={{ scale: 1.02, backgroundColor: '#4338ca' }}
          whileTap={{ scale: 0.98 }}
          onClick={onProcess}
          disabled={!hasFile || !operation || isProcessing}
          className={`relative flex items-center justify-center gap-3 w-full py-5 px-8 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl ${
            !hasFile || !operation || isProcessing
              ? 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
              : 'bg-indigo-600 text-white shadow-indigo-200'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          <span>{isProcessing ? 'Processing...' : 'Apply Changes'}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Controls;