import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FloatingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export function FloatingSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  required = false 
}: FloatingSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue || isOpen;

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div
        className={`
          w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl
          transition-all duration-200 ease-out cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          hover:border-gray-300
          ${hasValue ? 'pt-6 pb-2' : ''}
          ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-400' : ''}
        `}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsFocused(true);
        }}
      >
        <div className="flex items-center justify-between">
          <span className={hasValue ? 'text-gray-900' : 'text-transparent'}>
            {selectedOption?.label || 'placeholder'}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
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

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`
                px-4 py-3 cursor-pointer transition-colors
                hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl
                ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
              `}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setIsOpen(false);
            setIsFocused(false);
          }}
        />
      )}
    </div>
  );
}