import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, AlertCircle } from 'lucide-react';

interface Props {
  onConfidenceScore: (score: number) => void;
}

export function VideoFeedback({ onConfidenceScore }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 320,
            height: 240,
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setHasPermission(true);
        setError(null);
        
        // Simulate confidence analysis
        const analyzeInterval = setInterval(() => {
          const confidence = 7 + Math.random() * 3;
          onConfidenceScore(confidence);
        }, 2000);

        return () => clearInterval(analyzeInterval);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasPermission(false);
        setError('Camera access denied. Please check your browser settings.');
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onConfidenceScore]);

  return (
    <div className="w-[320px]">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg overflow-hidden bg-gray-100"
        >
          {hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[240px] object-cover"
            />
          ) : (
            <div className="w-full h-[240px] flex items-center justify-center bg-gray-100">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </motion.div>

        {error && (
          <div className="mt-2 p-2 bg-yellow-50 rounded-lg flex items-center text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
            <span className="text-yellow-700">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}