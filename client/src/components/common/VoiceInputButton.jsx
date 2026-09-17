import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceInputButton({
  onTranscript,
  mode = 'append', // 'append' | 'replace'
  currentValue = '',
  lang = 'hi-IN',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  title = 'बोलकर टाइप करें (Voice Typing)'
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang; // Hindi by default

    recognition.onstart = () => {
      setIsListening(true);
      setInterimText('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const textChunk = finalTranscript || interimTranscript;
      setInterimText(textChunk);

      if (finalTranscript && onTranscript) {
        if (mode === 'append') {
          const separator = currentValue && !currentValue.endsWith(' ') ? ' ' : '';
          onTranscript((currentValue || '') + separator + finalTranscript);
        } else {
          onTranscript(finalTranscript);
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [lang, mode, currentValue, onTranscript]);

  const toggleListen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      alert('आपके ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया Google Chrome, Edge या Safari का उपयोग करें।');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-1.5 text-xs',
    lg: 'p-2 text-sm'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListen}
        className={`rounded-xl font-bold transition flex items-center justify-center cursor-pointer relative ${
          isListening
            ? 'bg-red-600 text-white shadow-lg ring-4 ring-red-300 animate-pulse'
            : 'bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-700 border border-slate-200'
        } ${sizeClasses[size] || sizeClasses.md} ${className}`}
        title={isListening ? 'सुन रहा हूँ... बोलिए (बोलना बंद करने के लिए क्लिक करें)' : title}
      >
        {isListening ? (
          <Mic className={`${iconSizes[size] || iconSizes.md} text-white animate-bounce`} />
        ) : (
          <Mic className={`${iconSizes[size] || iconSizes.md}`} />
        )}
      </button>

      {/* Floating Visual Feedback when Recording */}
      {isListening && (
        <div className="absolute left-full ml-2 z-50 whitespace-nowrap px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg shadow-xl flex items-center space-x-1.5 animate-fadeIn pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>बोलिए... {interimText ? `"${interimText}"` : 'सुन रहा हूँ...'}</span>
        </div>
      )}
    </div>
  );
}
