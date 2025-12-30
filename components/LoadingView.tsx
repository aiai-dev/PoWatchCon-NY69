/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "PREPARING THE CIVIC FESTIVITIES...",
  "LIGHTING THE ORANGE FIREWORKS...",
  "DRAFTING NEW YEAR RESOLUTIONS...",
  "SETTING THE CELEBRATORY AMBIANCE...",
  "POLISHING THE UPCOMING 2026...",
  "ANALYZING POLICY TRENDS...",
  "ALMOST READY FOR THE TOAST...",
];

const LoadingView: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-center p-12 rounded-xl border-2 border-orange-500/40 bg-zinc-900/80 backdrop-blur-md shadow-2xl">
      <div className="flex justify-center mb-8">
        <div className="spinner"></div>
      </div>
      <div className="text-xl font-serif italic text-orange-200 tracking-wide animate-pulse">
        {loadingMessages[messageIndex % loadingMessages.length]}
      </div>
    </div>
  );
};

export default LoadingView;