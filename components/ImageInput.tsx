/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';

interface ImageInputProps {
  onImageReady: (imageData: { data: string; mimeType: string; caption: string }) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageReady }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraInitializing, setIsCameraInitializing] = useState(true);
  const [caption, setCaption] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    const enableStream = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera not supported by this browser.");
        }
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Camera access denied.");
      } finally {
        setIsCameraInitializing(false);
      }
    };

    enableStream();

    return () => {
      mediaStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl && stream) {
      videoEl.srcObject = stream;
      videoEl.onloadedmetadata = () => {
        videoEl.play().catch(e => console.error("Video play failed", e));
      };
    }
  }, [stream]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
            const base64 = result.split(',')[1];
            onImageReady({ data: base64, mimeType: file.type, caption: caption.trim() || "สวัสดีปีใหม่ 2026" });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        onImageReady({ data: base64, mimeType: 'image/jpeg', caption: caption.trim() || "สวัสดีปีใหม่ 2026" });
        
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4 rounded-2xl bg-orange-950/20 border border-orange-500/20 shadow-2xl backdrop-blur-sm">
      <div className="w-full mb-6">
        <label className="block text-orange-200 text-sm font-bold mb-2 uppercase tracking-widest ml-1">
          ข้อความบนภาพ (Your Message)
        </label>
        <input 
          type="text" 
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="พิมพ์ข้อความของคุณที่นี่..."
          className="w-full bg-black/40 border border-orange-500/30 rounded-lg p-4 text-orange-100 placeholder:text-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg shadow-inner"
        />
      </div>

      <div className="w-full max-w-xl aspect-[4/5] bg-black border-2 border-orange-500/40 rounded-xl overflow-hidden relative shadow-inner">
        <video 
            ref={videoRef}
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]"
        ></video>
        {(isCameraInitializing || cameraError) && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-zinc-900">
                {isCameraInitializing ? (
                    <div className="flex flex-col items-center">
                        <div className="spinner mb-4"></div>
                        <p className="text-orange-400 font-bold uppercase tracking-widest">Initializing Camera...</p>
                    </div>
                ) : (
                    <p className="text-orange-200 opacity-80">{cameraError}</p>
                )}
            </div>
        )}
        {stream && !cameraError && !isCameraInitializing && (
             <button
                onClick={handleCapture}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md p-1 hover:scale-110 active:scale-95 transition-all group z-10"
                aria-label="Capture photo"
            >
                <div className="w-full h-full rounded-full bg-orange-500 shadow-[0_0_20px_rgba(255,140,0,0.8)] group-hover:bg-orange-400" />
            </button>
        )}
      </div>
     
      <div className="mt-8 text-center w-full max-w-xl">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-transparent text-orange-400 py-4 px-8 border border-orange-500/50 rounded-xl hover:bg-orange-500/10 hover:text-orange-300 transition-all font-bold tracking-widest w-full text-lg shadow-lg"
        >
          หรืออัพโหลดจากคลังภาพ (UPLOAD)
        </button>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default ImageInput;