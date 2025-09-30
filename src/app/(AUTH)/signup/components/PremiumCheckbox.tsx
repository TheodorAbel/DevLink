import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PremiumCheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PremiumCheckbox({ id, label, description, checked, onChange }: PremiumCheckboxProps) {
  return (
    <motion.label
      htmlFor={id}
      className={`
        group relative flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300
        border-2 bg-gradient-to-br backdrop-blur-sm
        ${checked
          ? 'border-blue-400 from-blue-50/80 to-purple-50/80 shadow-lg shadow-blue-500/10'
          : 'border-gray-200 from-white/60 to-white/40 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-500/5'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Custom checkbox */}
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        
        <motion.div
          className={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
            ${checked
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-500 shadow-lg shadow-blue-500/25'
              : 'bg-white border-gray-300 group-hover:border-gray-400 shadow-sm'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            initial={false}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
        
        {/* Ripple effect */}
        {checked && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-blue-400/20"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </div>
      
      {/* Label and description */}
      <div className="flex-1 min-w-0">
        <div className={`
          font-medium transition-colors duration-300
          ${checked ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
        `}>
          {label}
        </div>
        {description && (
          <div className="text-sm text-gray-500 mt-1 leading-relaxed">
            {description}
          </div>
        )}
      </div>
      
      {/* Selected indicator */}
      {checked && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"
        />
      )}
    </motion.label>
  );
}