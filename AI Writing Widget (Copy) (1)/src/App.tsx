import React, { useState } from 'react';
import { PersonaSelector } from './components/PersonaSelector';
import { ShortcutButton } from './components/ShortcutButton';
import { Scissors, CheckCircle, X, Copy } from 'lucide-react';
import exampleImage from 'figma:asset/cbdcd6fd38a8c2d5842fa0a6299f6993dae54b65.png';

export default function App() {
  const [prompt, setPrompt] = useState('');

  const handleShortcutAction = (action: string) => {
    console.log(`Executing ${action} action`);
    // In a real app, this would process the selected text or current prompt
  };

  const handleClose = () => {
    console.log('Closing widget');
    // In a real app, this would close or hide the widget
  };

  const handleCopy = () => {
    if (prompt.trim()) {
      navigator.clipboard.writeText(prompt);
      console.log('Copied prompt to clipboard');
    }
    // In a real app, this would copy the current prompt or result
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      console.log('Executing custom prompt:', prompt);
      // In a real app, this would send the prompt to an AI service
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        backgroundImage: `url(${exampleImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Main Widget */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl ring-1 ring-black/5">
        {/* Top Section: Persona Selector and Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <PersonaSelector />
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200 shadow-sm ring-1 ring-black/5"
            >
              <Copy className="w-4 h-4 text-gray-700" />
            </button>
            
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200 shadow-sm ring-1 ring-black/5"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Main Prompt Area */}
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write, edit, or ask anything..."
            className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-600 text-lg leading-relaxed"
            style={{ fontSize: '16px' }}
          />
          
          {/* Subtle hint text */}
          <div className="text-xs text-gray-500 mt-1">
            Press ⌘+Enter to execute custom prompts
          </div>
        </div>

        {/* Shortcut Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <ShortcutButton
            icon={Scissors}
            text="Make Shorter"
            onClick={() => handleShortcutAction('make-shorter')}
          />
          <ShortcutButton
            icon={CheckCircle}
            text="Fix Grammar"
            onClick={() => handleShortcutAction('fix-grammar')}
          />
        </div>
      </div>
    </div>
  );
}