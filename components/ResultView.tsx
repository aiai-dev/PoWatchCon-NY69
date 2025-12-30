/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import Polaroid from './Polaroid';
import ChatInput from './ChatInput';

interface ResultViewProps {
  imageUrl: string;
  videoUrl: string | null;
  onReset: () => void;
  onEdit: (prompt: string) => void;
  onBringToLife: () => void;
  isRegenerating: boolean;
  editError: string | null;
  videoError: string | null;
  caption: string;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  imageUrl, 
  videoUrl, 
  onReset, 
  onEdit, 
  onBringToLife, 
  isRegenerating, 
  editError, 
  videoError,
  caption
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    if (videoUrl) {
      link.href = videoUrl;
      link.download = 'policy-watch-2026.mp4';
    } else {
      link.href = imageUrl;
      link.download = 'policy-watch-2026.png';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasVideo = !!videoUrl;

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <Polaroid 
        imageUrl={imageUrl} 
        videoUrl={videoUrl} 
        isRegenerating={isRegenerating}
        onClick={() => setIsPreviewOpen(true)}
        caption={caption}
      />

      {!hasVideo && (
        <div className="w-full max-w-lg mt-12 bg-black/20 p-6 rounded-2xl border border-orange-500/10 backdrop-blur-sm">
          <p className="text-orange-200/60 text-xs font-bold uppercase tracking-widest mb-4 text-center">
            Adjust styling or lighting (เช่น "เพิ่มแสงส้ม", "เปลี่ยนแนวพลุ")
          </p>
          <ChatInput onPromptSubmit={onEdit} disabled={isRegenerating} />
          {editError && (
            <p className="text-red-400 text-sm font-medium text-center mt-3">{editError}</p>
          )}
        </div>
      )}

      {videoError && <p className="text-red-400 text-sm font-medium text-center mt-4">{videoError}</p>}

      <div className="w-full max-w-lg mt-8 px-4 text-center">
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <p className="text-orange-100 text-sm leading-relaxed mb-2">
            ขอบคุณที่มาร่วมสนุกกับ Policy Watch Thai PBS! 
            หวังว่าจะได้เจอทุกท่านที่งาน Policy Watch Connect 2026 ณ สัปปายสภาสถาน
          </p>
          <p className="text-orange-400 font-bold">
            ลงทะเบียนได้ที่นี่: <a href="https://bit.ly/4qBAjWl" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-300 transition-colors">https://bit.ly/4qBAjWl</a>
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-lg">
        <button
          onClick={onReset}
          disabled={isRegenerating}
          className="flex-1 bg-transparent text-orange-200 py-4 border border-orange-500/50 rounded-xl hover:bg-orange-950 transition-all font-bold tracking-wider disabled:opacity-50"
        >
          ทำใหม่ (START OVER)
        </button>
        <button
          onClick={handleDownload}
          disabled={isRegenerating}
          className="flex-1 bg-orange-600 text-white py-4 border border-orange-400/50 rounded-xl font-bold hover:bg-orange-500 active:bg-orange-700 transition-all shadow-xl disabled:opacity-50"
        >
          {hasVideo ? 'โหลดวิดีโอ (MP4)' : 'ดาวน์โหลดรูปภาพ'}
        </button>
        {!hasVideo && (
            <button
                onClick={onBringToLife}
                disabled={isRegenerating}
                className="flex-1 bg-white text-zinc-900 py-4 rounded-xl font-bold hover:bg-zinc-100 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
                ขยับภาพ (ANIMATE)
            </button>
        )}
      </div>

      {isPreviewOpen && (
        <div 
          className="fixed inset-0 bg-black/98 flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-14 right-0 text-white hover:text-orange-400 transition-colors text-5xl font-light"
              onClick={() => setIsPreviewOpen(false)}
            >
              &times;
            </button>
            {hasVideo ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-[0_0_50px_rgba(255,140,0,0.3)] border border-white/10" 
              />
            ) : (
              <img 
                src={imageUrl} 
                alt="Full Greeting" 
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-[0_0_50px_rgba(255,140,0,0.3)] border border-white/10"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;