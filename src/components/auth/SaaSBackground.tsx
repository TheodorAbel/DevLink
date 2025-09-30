"use client";

import { motion } from "framer-motion";
import { Briefcase, Search, Link2, Sparkles } from "lucide-react";

export function SaaSBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Animated dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-indigo-900" />
      
      {/* Dark gradient waves */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, #1e3a8a, #4f46e5, #06b6d4, #1e3a8a)',
            backgroundSize: '400% 400%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Large animated blobs - dark theme */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-600/40 to-blue-600/40 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-700/40 to-cyan-600/40 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-700/30 to-blue-700/30 rounded-full blur-3xl"
        animate={{
          x: [-50, 50, -50],
          y: [-50, 50, -50],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Additional smaller abstract blobs - dark theme */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-600/25 to-blue-600/25 rounded-full blur-2xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-700/20 to-blue-800/20 rounded-full blur-2xl"
        animate={{
          x: [0, -70, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Starfield particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Floating icons */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-indigo-400/15"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Briefcase className="w-12 h-12" />
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/3 text-cyan-400/15"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Search className="w-10 h-10" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-2/3 text-blue-400/15"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Link2 className="w-11 h-11" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/4 text-indigo-400/12"
        animate={{
          y: [0, 25, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      {/* Dark gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-900/30" />
    </div>
  );
}
