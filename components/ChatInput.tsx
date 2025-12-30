/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface ChatInputProps {
    onPromptSubmit: (prompt: string) => void;
    disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onPromptSubmit, disabled }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !disabled) {
            onPromptSubmit(prompt.trim());
            setPrompt('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-3">
            <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Adjust the greeting style..."
                disabled={disabled}
                className="flex-grow bg-zinc-900/60 border border-orange-500/30 text-orange-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 placeholder:text-orange-200/30"
            />
            <button type="submit" disabled={disabled} className="bg-orange-600 text-white py-4 px-8 rounded-lg font-bold hover:bg-orange-500 active:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400/50 shadow-lg">
                REDEFINE
            </button>
        </form>
    );
}

export default ChatInput;