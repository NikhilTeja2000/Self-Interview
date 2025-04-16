import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface Props {
  isRecording: boolean;
  hasError: boolean;
  errorMessage?: string;
  onClick?: () => void;
}

export function RecordingIndicator({ 
  isRecording, 
  hasError, 
  errorMessage,
  onClick 
}: Props) {
  return (
    <div className="flex items-center">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          p-3 rounded-full flex items-center justify-center
          transition-colors duration-200
          ${isRecording 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'}
          ${hasError ? 'border-2 border-yellow-500' : ''}
        `}
      >
        <div className={isRecording ? "animate-pulse" : ""}>
          {isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </div>
        <span className="ml-2 font-medium text-sm">
          {isRecording ? 'Stop' : 'Record'}
        </span>
      </motion.button>
      
      {hasError && errorMessage && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-3 text-sm text-yellow-700 flex items-center bg-yellow-50 px-2 py-1 rounded"
        >
          <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
          {errorMessage}
        </motion.div>
      )}
    </div>
  );
}