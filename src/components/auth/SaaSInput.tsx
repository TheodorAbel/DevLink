"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface SaaSInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
  delay?: number;
}

export function SaaSInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  delay = 0,
}: SaaSInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <label className="block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
          isFocused ? "text-indigo-400" : "text-slate-500"
        }`}>
          {icon}
        </div>
        <motion.input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200 outline-none text-white placeholder-slate-500 ${
            isFocused
              ? "border-indigo-400 bg-slate-800/80 shadow-lg shadow-indigo-400/20"
              : "border-slate-700 bg-slate-800/60 hover:border-slate-600"
          }`}
          whileFocus={{ scale: 1.01 }}
        />
      </div>
    </motion.div>
  );
}
