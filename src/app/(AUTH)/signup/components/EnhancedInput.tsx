import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

interface EnhancedInputProps {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  validation?: (value: string) => { isValid: boolean; message?: string };
}

export function EnhancedInput({ 
  label, 
  icon,
  type = 'text', 
  value, 
  onChange, 
  required = false,
  placeholder = '',
  validation
}: EnhancedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  
  const safeValue = value ?? '';
  const hasValue = safeValue.length > 0;
  const isFloating = isFocused || hasValue;
  
  const validationResult = validation && hasBeenTouched ? validation(safeValue) : null;
  const showValidation = hasBeenTouched && hasValue;
  const isValid = !validation || validationResult?.isValid !== false;
  
  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type={type}
          value={safeValue}
          onChange={(e) => onChange(e.target.value ?? '')}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={isFloating ? placeholder : ''}
          className={`
            w-full pl-12 pr-12 py-4 bg-white/60 backdrop-blur-sm border-2 rounded-2xl
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400
            hover:border-gray-300 hover:shadow-lg hover:bg-white/70
            ${hasValue ? 'pt-6 pb-2' : ''}
            ${isFocused ? 'shadow-xl bg-white/80' : 'shadow-md'}
            ${showValidation && !isValid ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : 'border-gray-200'}
            ${showValidation && isValid ? 'border-green-400' : ''}
          `}
          required={required}
        />
        
        {/* Icon */}
        <div className={`
          absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300
          ${isFocused ? 'text-blue-500 scale-110' : 'text-gray-400'}
          ${showValidation && !isValid ? 'text-red-500' : ''}
          ${showValidation && isValid ? 'text-green-500' : ''}
        `}>
          {icon}
        </div>
        
        {/* Validation indicator */}
        {showValidation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {isValid ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </motion.div>
        )}
        
        {/* Floating label */}
        <label
          className={`
            absolute left-12 transition-all duration-300 ease-out pointer-events-none
            ${isFloating 
              ? 'top-2 text-xs text-gray-500' 
              : 'top-4 text-base text-gray-400'
            }
            ${isFocused ? 'text-blue-500' : ''}
            ${showValidation && !isValid ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {/* Validation message */}
      {showValidation && validationResult && !validationResult.isValid && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-2 mt-2 px-2"
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600">{validationResult.message}</span>
        </motion.div>
      )}
    </div>
  );
}