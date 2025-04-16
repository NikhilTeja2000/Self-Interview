import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  hasRecognitionSupport: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition({
  continuous = true,
  interimResults = true,
  lang = 'en-US'
}: SpeechRecognitionOptions = {}): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const maxRetries = 3;
  const hasRecognitionSupport = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  
  const createRecognitionInstance = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return null;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setRetryCount(0);
    };
    
    recognition.onresult = (event: any) => {
      const combinedTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      setTranscript(combinedTranscript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'network') {
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
        
        if (retryCount < maxRetries) {
          setError('Network error. Retrying speech recognition...');
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            startListening();
          }, retryDelay);
        } else {
          setError('Network error. Please check your internet connection and try again.');
          setIsListening(false);
        }
      } else {
        setError('An error occurred with speech recognition. Please try again.');
        setIsListening(false);
      }
    };
    
    recognition.onend = () => {
      // Only set isListening to false if we're not in the middle of a retry
      if (!retryTimeoutRef.current) {
        setIsListening(false);
      }
    };
    
    return recognition;
  }, [continuous, interimResults, lang, retryCount]);
  
  const startListening = useCallback(() => {
    if (!hasRecognitionSupport) {
      setError('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    setError(null);
    
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      const recognition = createRecognitionInstance();
      if (!recognition) return;
      
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition. Please try again.');
      setIsListening(false);
    }
  }, [hasRecognitionSupport, createRecognitionInstance]);
  
  const stopListening = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
    setIsListening(false);
    setRetryCount(0);
  }, []);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping recognition on cleanup:', err);
        }
      }
    };
  }, []);
  
  return {
    transcript,
    isListening,
    hasRecognitionSupport,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
}