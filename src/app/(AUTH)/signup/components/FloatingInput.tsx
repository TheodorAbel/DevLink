import { useState } from 'react';

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function FloatingInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  placeholder = '' 
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFloating ? placeholder : ''}
        className={`
          w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          hover:border-gray-300
          ${hasValue ? 'pt-6 pb-2' : ''}
        `}
        required={required}
      />
      <label
        className={`
          absolute left-4 transition-all duration-200 ease-out pointer-events-none
          ${isFloating 
            ? 'top-2 text-xs text-gray-500' 
            : 'top-4 text-base text-gray-400'
          }
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
}