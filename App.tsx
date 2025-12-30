/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import { startImageChatSession, continueImageChatSession, generateVideoFromImage } from './services/geminiService';
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import LoadingView from './components/LoadingView';
import ResultView from './components/ResultView';
import VideoPromptModal from './components/VideoPromptModal';
import Spinner from './components/Spinner';
import { Content } from '@google/genai';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Content[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [userCaption, setUserCaption] = useState<string>('');

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleImageReady = useCallback(async ({ data, mimeType, caption }: { data: string; mimeType: string, caption: string }) => {
    setAppState(AppState.PROCESSING);
    setErrorMessage(null);
    setOutputImageUrl(null);
    setConversationHistory([]);
    setUserCaption(caption);
    
    try {
      const { imageUrl, history } = await startImageChatSession(data, mimeType, caption);
      setOutputImageUrl(imageUrl);
      setConversationHistory(history);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(`SYSTEM ERROR: ${message}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleEditImage = useCallback(async (prompt: string) => {
    if (!conversationHistory.length) return;
    setIsRegenerating(true);
    setEditErrorMessage(null);
    try {
      const { imageUrl, newHistory } = await continueImageChatSession(conversationHistory, prompt);
      setOutputImageUrl(imageUrl);
      setConversationHistory(newHistory);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setEditErrorMessage(`MODIFICATION FAILED: ${message}`);
    } finally {
      setIsRegenerating(false);
    }
  }, [conversationHistory]);

  const handleGenerateVideo = useCallback(async (prompt: string, keyForGeneration: string) => {
    if (!outputImageUrl) return;
    setShowVideoModal(false);
    setIsGeneratingVideo(true);
    setVideoError(null);
    try {
        const generatedVideoUrl = await generateVideoFromImage(outputImageUrl, prompt, keyForGeneration);
        setVideoUrl(generatedVideoUrl);
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        setVideoError(`ANIMATION FAILED: ${message}`);
    } finally {
        setIsGeneratingVideo(false);
    }
  }, [outputImageUrl]);


  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setOutputImageUrl(null);
    setErrorMessage(null);
    setEditErrorMessage(null);
    setConversationHistory([]);
    setShowVideoModal(false);
    setIsGeneratingVideo(false);
    setVideoUrl(null);
    setVideoError(null);
    setUserCaption('');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <LoadingView />;
      case AppState.RESULT:
        return outputImageUrl ? (
          <ResultView
            imageUrl={outputImageUrl}
            videoUrl={videoUrl}
            onReset={handleReset}
            onEdit={handleEditImage}
            onBringToLife={() => setShowVideoModal(true)}
            isRegenerating={isRegenerating}
            editError={editErrorMessage}
            videoError={videoError}
            caption={userCaption}
          />
        ) : null;
      case AppState.ERROR:
        return (
          <div className="text-center text-orange-200 bg-black bg-opacity-70 p-8 border-2 border-orange-500 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">UNEXPECTED ERROR</h2>
            <p className="text-lg opacity-80">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="mt-8 bg-orange-600 text-white py-3 px-10 rounded-md font-bold hover:bg-orange-500 transition-colors uppercase tracking-widest border border-orange-400"
            >
              Back to Start
            </button>
          </div>
        );
      case AppState.IDLE:
      default:
        return <ImageInput onImageReady={handleImageReady} />;
    }
  };

  return (
    <div
      className="min-h-screen text-orange-100 p-4 sm:p-8 flex flex-col items-center"
      style={{
        backgroundColor: '#0a0805',
        backgroundImage: `
          linear-gradient(rgba(10, 8, 5, 0.85), rgba(10, 8, 5, 0.85)),
          url('https://www.transparenttextures.com/patterns/stardust.png')
        `,
      }}
    >
      {isGeneratingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-6 text-center">
          <Spinner />
          <p className="text-orange-400 text-3xl font-bold mt-8 tracking-wide uppercase">Animating Your Greeting...</p>
          <p className="text-orange-200 text-lg mt-4 opacity-70 italic">"The future is built on today's vision."</p>
        </div>
      )}
      {showVideoModal && (
        <VideoPromptModal 
          onClose={() => setShowVideoModal(false)}
          onSubmit={handleGenerateVideo}
          apiKey={apiKey}
          onSetApiKey={setApiKey}
        />
      )}
      <Header />
      <main className="w-full max-w-2xl flex-grow flex flex-col justify-center items-center mt-8 mb-12">
        {renderContent()}
      </main>
      <footer className="text-center text-xs text-orange-500/50 mt-auto uppercase tracking-tighter py-4">
        <p>© 2025-2026 Policy Watch | New Year Greetings Engine</p>
      </footer>
    </div>
  );
};

export default App;