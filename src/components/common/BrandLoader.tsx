import React, { useEffect, useState } from 'react';

interface BrandLoaderProps {
  statusText?: string;
}

const BrandLoader: React.FC<BrandLoaderProps> = ({ statusText }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full animate-in fade-in duration-500">
      
      {/* Cubic Scanner Animation */}
      <div className="relative w-32 h-32 mb-12">
        {/* Outer Scanner Ring */}
        <div className="absolute inset-0 border-2 border-dashed border-zinc-200 rounded-2xl animate-[spin_10s_linear_infinite]"></div>
        
        {/* Middle Pulse Ring */}
        <div className="absolute inset-2 border border-zinc-900/10 rounded-xl animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        
        {/* Inner Solid Box */}
        <div className="absolute inset-8 bg-zinc-900 rounded-lg shadow-2xl shadow-black/20 flex items-center justify-center transform transition-transform animate-[pulse_3s_ease-in-out_infinite]">
           <img src="/logo.png" alt="Scanning" className="w-10 h-10 opacity-80" />
        </div>

        {/* Scanning Line - Vertical */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
           <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-black/5 to-transparent animate-[scan_2s_linear_infinite] translate-y-[-100%]"></div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-black rounded-tl-lg"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-black rounded-tr-lg"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-black rounded-bl-lg"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-black rounded-br-lg"></div>
      </div>

      {/* Dynamic Text */}
      <div className="text-center space-y-2 max-w-xs">
        <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Processing Analysis</h3>
        <p className="text-zinc-500 font-mono text-sm h-6 transition-all duration-300">
           {statusText ? (
             <span className="animate-pulse">{`> ${statusText}`}</span>
           ) : (
             "Initializing..."
           )}
        </p>
      </div>

      {/* Progress Indicating Dots */}
      <div className="flex gap-2 mt-8">
        <div className="w-2 h-2 rounded-full bg-zinc-900 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-zinc-900 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-zinc-900 animate-bounce"></div>
      </div>

    </div>
  );
};

export default BrandLoader;
