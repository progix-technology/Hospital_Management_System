import React from 'react';

/**
 * Premium PageLoader fallback shown during React.lazy route chunk loading
 */
export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 transition-opacity duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 animate-ping absolute"></div>
        {/* Spinning gradient ring */}
        <div className="w-16 h-16 rounded-full border-4 border-t-emerald-600 border-r-transparent border-b-emerald-600/30 border-l-transparent animate-spin"></div>
        {/* Center brand logo icon */}
        <div className="absolute w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shadow-inner">
          <svg 
            className="w-4 h-4 text-emerald-600 dark:text-emerald-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase animate-pulse">
        Loading Medisphere...
      </p>
    </div>
  );
}
