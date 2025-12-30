/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse, Content, Part, GenerateVideosParameters, Modality } from "@google/genai";

const getInitialPrompt = (caption: string) => `Create a professional, high-end celebratory New Year greeting portrait of this person. 
The setting is a spectacular night scene featuring breathtaking, vibrant orange and gold fireworks lighting up the sky.
The person should have warm, cinematic lighting on their face that matches the orange glow of the fireworks.
The mood of the photo should be inspired by the theme: "${caption}".

CRITICAL INSTRUCTION: 
1. DO NOT include any text, words, letters, or numbers in the image.
2. DO NOT include any logos, watermarks, symbols, or branding elements (including the words 'Policy Watch').
3. The image must be a clean, artistic photograph only.
4. No graphic design overlays or written characters of any kind should be visible.

Never respond with text. Just generate the photo.`;

const parseGeminiResponse = (response: GenerateContentResponse): { imageUrl: string, modelResponseContent: Content } => {
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("Invalid response from API. No content parts found.");
  }

  let imageData: string | null = null;
  let outputMimeType = "image/png";
  let responseText = "";
  
  for (const part of parts) {
    if (part.text) {
      responseText += part.text;
    } else if (part.inlineData?.data) {
      imageData = part.inlineData.data;
      if (part.inlineData.mimeType && part.inlineData.mimeType !== "application/octet-stream") {
        outputMimeType = part.inlineData.mimeType;
      }
    }
  }

  if (!imageData) {
    const errorMessage = responseText.trim()
      ? `Generation Error: "${responseText.trim()}"`
      : "Generation Error: API did not return image data.";
    throw new Error(errorMessage);
  }
  
  const modelResponseContent: Content = response.candidates?.[0]?.content as Content;
  
  return {
    imageUrl: `data:${outputMimeType};base64,${imageData}`,
    modelResponseContent: modelResponseContent
  };
};

export const startImageChatSession = async (
  base64Image: string,
  mimeType: string,
  caption: string
): Promise<{ imageUrl: string, history: Content[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image'; 

  const userContent: Content = {
    role: 'user',
    parts: [
      { text: getInitialPrompt(caption) },
      { inlineData: { data: base64Image, mimeType } }
    ]
  };
  
  const config = { responseModalities: [Modality.IMAGE, Modality.TEXT] };

  const response = await ai.models.generateContent({
    model,
    contents: [userContent],
    config,
  });

  const { imageUrl, modelResponseContent } = parseGeminiResponse(response);

  return {
    imageUrl,
    history: [userContent, modelResponseContent]
  };
};

export const continueImageChatSession = async (
  history: Content[],
  prompt: string
): Promise<{ imageUrl: string, newHistory: Content[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';

  const userContent: Content = {
    role: 'user',
    parts: [{ text: `Adjust the photo based on this request: ${prompt}. 
      STRICT NEGATIVE CONSTRAINT: Ensure there is absolutely NO text, NO logos, NO writing, and NO symbols added to the image. 
      Keep the night setting and the vibrant orange firework theme as a clean photograph.` }]
  };

  const newHistory = [...history, userContent];
  const config = { responseModalities: [Modality.IMAGE, Modality.TEXT] };

  const response = await ai.models.generateContent({
    model,
    contents: newHistory,
    config,
  });

  const { imageUrl, modelResponseContent } = parseGeminiResponse(response);
  
  return {
    imageUrl,
    newHistory: [...newHistory, modelResponseContent]
  };
};

const dataUrlToBase64 = (dataUrl: string): { base64: string, mimeType: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const base64 = parts[1];
    return { base64, mimeType };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateVideoFromImage = async (
    imageUrl: string,
    prompt: string,
    apiKey: string
): Promise<string> => {
    if (!apiKey) throw new Error("API Key required.");
    const ai = new GoogleGenAI({ apiKey });
    const model = 'veo-3.1-fast-generate-preview';
    const { base64: imageBytes, mimeType } = dataUrlToBase64(imageUrl);

    const config: GenerateVideosParameters = {
        model,
        prompt: `Animate the fireworks in the background to sparkle and bloom elegantly. The person remains mostly still but with a subtle lighting shimmer from the explosions. Ensure NO text or graphics are added during the animation. ${prompt}`,
        config: { 
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        },
        image: { imageBytes, mimeType }
    };

    let operation = await ai.models.generateVideos(config);

    while (!operation.done) {
        await delay(5000);
        operation = await ai.operations.getVideosOperation({ operation });
    }

    const video = operation.response?.generatedVideos?.[0];
    if (!video?.video?.uri) throw new Error("Video generation failed.");
    
    const res = await fetch(`${video.video.uri}&key=${apiKey}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
};