/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface VideoPromptModalProps {
  onClose: () => void;
  onSubmit: (prompt: string, apiKey: string) => void;
  apiKey: string | null;
  onSetApiKey: (key: string) => void;
}

const VideoPromptModal: React.FC<VideoPromptModalProps> = ({ onClose, onSubmit, apiKey, onSetApiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [keyInput, setKeyInput] = useState('');

  const isApiKeyNeeded = !apiKey;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyToUse = apiKey || keyInput.trim();
    if (keyToUse && prompt.trim()) {
      if (isApiKeyNeeded) {
        onSetApiKey(keyToUse);
      }
      onSubmit(prompt.trim(), keyToUse);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-orange-500/50 p-8 w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(255,140,0,0.2)] relative" onClick={e => e.stopPropagation()}>
        <h3 className="text-3xl font-serif italic text-orange-200 mb-2 text-center">Animate the Celebration</h3>
        <p className="text-center text-orange-400/60 text-sm mb-8 font-serif uppercase tracking-widest">Powered by Veo</p>
        
        {isApiKeyNeeded && (
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg mb-6">
            <p className="text-orange-200 text-sm mb-2 text-center">
              Requires a Google AI API key (paid GCP project recommended).
            </p>
            <div className="text-center">
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-orange-400 underline hover:text-orange-300 transition-colors"
              >
                Learn about billing documentation
              </a>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {isApiKeyNeeded && (
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter your API Key"
              required
              className="w-full bg-zinc-950 border border-orange-500/30 text-orange-100 p-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            />
          )}
          <div className="space-y-2">
            <label className="text-xs font-serif italic text-orange-200/50 block ml-1">Motion Prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "The fireworks explode and glow brightly"'
              autoFocus={!isApiKeyNeeded}
              required
              className="w-full bg-zinc-950 border border-orange-500/30 text-orange-100 p-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
             <button type="button" onClick={onClose} className="text-orange-200/60 hover:text-orange-200 py-3 px-6 transition-colors font-medium">
              CANCEL
            </button>
            <button type="submit" className="bg-orange-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-orange-500 active:scale-95 transition-all shadow-lg">
              BRING TO LIFE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoPromptModal;