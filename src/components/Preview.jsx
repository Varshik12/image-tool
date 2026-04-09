import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, MousePointer2, Frame } from 'lucide-react';

const Preview = ({ previewUrl, operation, params, setParams, dimensions, onImageLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    setIsDragging(false);
  }, [operation]);

  if (!previewUrl) return null;

  const handleMouseDown = (e) => {
    if (operation !== 'crop' || !dimensions.width || !imgRef.current) return;
    
    const rect = imgRef.current.getBoundingClientRect();
    const scaleX = dimensions.width / rect.width;
    const scaleY = dimensions.height / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    setIsDragging(true);
    setStartPos({ x, y });
    
    setParams(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, dimensions.width)),
      y: Math.max(0, Math.min(y, dimensions.height)),
      width: 0,
      height: 0
    }));
  };

  const handleMouseMove = (e) => {
    if (!isDragging || operation !== 'crop' || !dimensions.width) return;
    
    const rect = imgRef.current.getBoundingClientRect();
    const scaleX = dimensions.width / rect.width;
    const scaleY = dimensions.height / rect.height;
    
    const currentX = Math.round((e.clientX - rect.left) * scaleX);
    const currentY = Math.round((e.clientY - rect.top) * scaleY);
    
    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);
    
    const finalX = Math.max(0, Math.min(x, dimensions.width));
    const finalY = Math.max(0, Math.min(y, dimensions.height));
    const finalWidth = Math.min(width, dimensions.width - finalX);
    const finalHeight = Math.min(height, dimensions.height - finalY);

    setParams(prev => ({
      ...prev,
      x: finalX,
      y: finalY,
      width: finalWidth,
      height: finalHeight
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getOverlayStyle = () => {
    if (operation !== 'crop' || !dimensions.width || (params.width === 0 && params.height === 0)) {
      return { display: 'none' };
    }
    
    const left = (params.x / dimensions.width) * 100;
    const top = (params.y / dimensions.height) * 100;
    const width = (params.width / dimensions.width) * 100;
    const height = (params.height / dimensions.height) * 100;
    
    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
      border: '2px solid #6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      position: 'absolute',
      pointerEvents: 'none',
      boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.6)',
      zIndex: 10,
      backdropFilter: 'blur(1px)'
    };
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col gap-6 h-full min-h-[600px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-bold text-slate-700 tracking-tight">Preview Canvas</span>
        </div>
        {operation === 'crop' && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 animate-pulse">
            <MousePointer2 className="w-3 h-3" />
            <span>Select Area</span>
          </div>
        )}
      </div>

      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-checkerboard rounded-2xl p-8 border border-slate-100 overflow-hidden relative select-none shadow-inner"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative inline-block group">
          <img
            ref={imgRef}
            src={previewUrl}
            alt="Preview"
            className={`max-w-full max-h-[500px] rounded-lg shadow-2xl object-contain block transition-all ${operation === 'crop' ? 'cursor-crosshair' : ''}`}
            referrerPolicy="no-referrer"
            onMouseDown={handleMouseDown}
            onLoad={onImageLoad}
            draggable={false}
          />
          
          {operation === 'crop' && (
            <div 
              className="absolute inset-0 z-20 cursor-crosshair"
              onMouseDown={handleMouseDown}
            />
          )}

          <div style={getOverlayStyle()} className="rounded-sm">
            <div className="absolute -top-8 left-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl">
              {params.width} &times; {params.height}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Frame className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Original: {dimensions.width || '0'} &times; {dimensions.height || '0'}
          </span>
        </div>
        <div className="text-[10px] font-medium text-slate-300 uppercase tracking-[0.2em]">
          Live Rendering
        </div>
      </div>
    </div>
  );
};

export default Preview;
