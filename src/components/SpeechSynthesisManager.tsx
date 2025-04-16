import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface Props {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  enabled: boolean;
  toggleEnabled: () => void;
}

export function SpeechSynthesisManager({ 
  text, 
  autoPlay = true,
  onStart, 
  onEnd,
  enabled,
  toggleEnabled
}: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Get available voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopSpeaking();
    };
  }, []);
  
  // Find the best voice
  const getBestVoice = () => {
    if (voices.length === 0) return null;
    
    return voices.find(voice => 
      voice.name.includes('Google') && voice.name.includes('US') && voice.name.includes('Female')
    ) || 
    voices.find(voice => 
      voice.name.includes('Google') && voice.name.includes('US')
    ) ||
    voices.find(voice => 
      voice.lang.includes('en-US') && voice.name.includes('Female')
    ) ||
    voices.find(voice => 
      voice.lang.includes('en-US')
    ) ||
    voices.find(voice => 
      voice.lang.includes('en')
    ) ||
    voices[0];
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsProcessing(false);
    if (onEnd) onEnd();
  };
  
  const speak = async (speakText: string) => {
    if (!enabled || isProcessing) return;
    
    setIsProcessing(true);
    stopSpeaking();
    
    // Add a small delay before starting new speech
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      
      const bestVoice = getBestVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsProcessing(false);
        if (onStart) onStart();
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsProcessing(false);
        if (onEnd) onEnd();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        setIsProcessing(false);
        
        if (enabled) {
          timeoutRef.current = setTimeout(() => {
            speak(speakText);
          }, 1000);
        } else if (onEnd) {
          onEnd();
        }
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis setup error:', error);
      setIsProcessing(false);
      if (onEnd) onEnd();
    }
  };
  
  useEffect(() => {
    if (!enabled) {
      stopSpeaking();
      return;
    }

    if (text && autoPlay && enabled && !isProcessing) {
      speak(text);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopSpeaking();
    };
  }, [text, autoPlay, enabled]);
  
  const handleToggle = () => {
    if (isSpeaking || isProcessing) {
      stopSpeaking();
    }
    toggleEnabled();
  };
  
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full transition-colors ${
          enabled ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={enabled ? "Voice enabled" : "Voice disabled"}
      >
        {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
      
      {enabled && (isSpeaking || isProcessing) && (
        <div className="flex items-center">
          <AudioWaveform 
            isActive={true} 
            color="#4f46e5" 
            height={24} 
            width={2}
            bars={15}
          />
          <span className="ml-2 text-xs text-indigo-600 font-medium">
            {isProcessing ? 'Preparing...' : 'Speaking...'}
          </span>
        </div>
      )}
    </div>
  );
}