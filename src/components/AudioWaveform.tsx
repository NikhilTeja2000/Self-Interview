import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isActive: boolean;
  color: string;
  height?: number;
  width?: number;
  className?: string;
  bars?: number;
}

export function AudioWaveform({ 
  isActive, 
  color, 
  height = 40, 
  width = 3,
  className = "",
  bars = 30
}: Props) {
  return (
    <div 
      className={`flex items-center justify-center gap-[2px] ${className}`} 
      style={{ height: `${height}px` }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ 
            backgroundColor: color,
            width: `${width}px`
          }}
          animate={{
            height: isActive ? [
              `${Math.random() * 40 + 20}%`,
              `${Math.random() * 60 + 30}%`,
              `${Math.random() * 40 + 20}%`
            ] : '20%'
          }}
          transition={{
            duration: isActive ? 0.4 : 0.2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.01
          }}
        />
      ))}
    </div>
  );
}