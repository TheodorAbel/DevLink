import React from 'react';
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: 'gradient' | 'particles';
  className?: string;
}

export function AnimatedBackground({ variant = 'gradient', className = '' }: AnimatedBackgroundProps) {
  if (variant === 'particles') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * (window?.innerWidth || 1200),
              y: Math.random() * (window?.innerHeight || 800),
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        {/* Background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"
          animate={{
            background: [
              "linear-gradient(to bottom right, rgb(239 246 255 / 0.3), rgb(250 245 255 / 0.2), rgb(253 242 248 / 0.3))",
              "linear-gradient(to bottom right, rgb(219 234 254 / 0.4), rgb(237 233 254 / 0.3), rgb(252 231 243 / 0.4))",
              "linear-gradient(to bottom right, rgb(239 246 255 / 0.3), rgb(250 245 255 / 0.2), rgb(253 242 248 / 0.3))",
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      animate={{
        background: [
          "linear-gradient(45deg, rgb(59 130 246 / 0.05), rgb(147 51 234 / 0.05), rgb(236 72 153 / 0.05))",
          "linear-gradient(135deg, rgb(236 72 153 / 0.05), rgb(59 130 246 / 0.05), rgb(147 51 234 / 0.05))",
          "linear-gradient(225deg, rgb(147 51 234 / 0.05), rgb(236 72 153 / 0.05), rgb(59 130 246 / 0.05))",
          "linear-gradient(315deg, rgb(59 130 246 / 0.05), rgb(147 51 234 / 0.05), rgb(236 72 153 / 0.05))",
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  );
}