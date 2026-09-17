import { useState, useEffect, useRef } from 'react';

export function useSpeechToText({ lang = 'hi-IN', onResult } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);

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
    recognition.lang = lang; // 'hi-IN' by default, supports Hindi speech

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let current = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
      if (onResult) {
        onResult(current);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('माइक्रोफ़ोन की अनुमति अस्वीकृत की गई');
      } else {
        setError('आवाज़ पहचानी नहीं जा सकी');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang]);

  const toggleListening = (customLang) => {
    if (!recognitionRef.current) {
      alert('आपके ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया Google Chrome या Edge का उपयोग करें।');
      return;
    }

    if (customLang && recognitionRef.current.lang !== customLang) {
      recognitionRef.current.lang = customLang;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    error,
    toggleListening,
    stopListening
  };
}
