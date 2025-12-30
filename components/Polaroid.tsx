/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface PolaroidProps {
  imageUrl: string;
  videoUrl?: string | null;
  isRegenerating?: boolean;
  onClick: () => void;
  caption: string;
}

const Polaroid: React.FC<PolaroidProps> = ({ imageUrl, videoUrl, isRegenerating, onClick, caption }) => {
  return (
    <button 
      onClick={onClick}
      className="relative bg-white p-3 pb-24 shadow-[0_25px_60px_rgba(0,0,0,0.7)] rounded-sm transition-all duration-500 hover:scale-[1.03] text-left border border-white/20 group"
      aria-label="View larger image"
    >
      <div className="bg-black w-72 h-90 sm:w-80 sm:h-100 flex items-center justify-center overflow-hidden rounded-sm relative">
        {videoUrl ? (
          <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={imageUrl} alt="New Year Greeting" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 to-transparent pointer-events-none"></div>
        <div className="absolute top-2 right-2 bg-orange-500/80 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          TAP TO VIEW
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 text-center px-6">
        <p className="text-zinc-900 text-xl font-bold leading-tight border-t border-zinc-100 pt-6 px-2 min-h-[3rem] flex items-center justify-center">
          {caption || "สวัสดีปีใหม่ 2026"}
        </p>
      </div>
      {isRegenerating && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-sm">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-orange-100 text-lg font-bold tracking-wider animate-pulse">REFINING...</p>
            </div>
        </div>
      )}
    </button>
  );
};

export default Polaroid;