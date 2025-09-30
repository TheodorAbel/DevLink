import { useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

export function FloatingTextarea({ 
  label, 
  value, 
  onChange, 
  required = false,
  minLength = 0,
  maxLength = 500,
  rows = 4
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;
  const charCount = value.length;
  const isValidLength = charCount >= minLength && charCount <= maxLength;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl
          transition-all duration-200 ease-out resize-none
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          hover:border-gray-300
          ${hasValue ? 'pt-8 pb-4' : 'pt-4 pb-4'}
        `}
        required={required}
      />
      <label
        className={`
          absolute left-4 transition-all duration-200 ease-out pointer-events-none z-10
          ${isFloating 
            ? 'top-2 text-xs text-gray-500 bg-white/80 px-1 rounded' 
            : 'top-4 text-base text-gray-400'
          }
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex justify-between items-center mt-2 px-2">
        <div className="text-xs text-gray-400">
          {minLength > 0 && `Minimum ${minLength} characters`}
        </div>
        <motion.div 
          className={`text-xs font-medium ${isValidLength ? 'text-gray-500' : 'text-red-500'}`}
          key={charCount}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.2 }}
        >
          {charCount}/{maxLength}
        </motion.div>
      </div>
    </div>
  );
}