import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from './ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle2, Circle, User, Briefcase, FileText, Mail } from 'lucide-react';

interface ProfileStep {
  id: string;
  label: string;
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProfileProgressProps {
  onStepClick?: (stepId: string) => void;
  completedOverride?: Record<string, boolean>;
}

const profileSteps: ProfileStep[] = [
  { id: 'basic', label: 'Basic Information', completed: true, icon: User },
  { id: 'experience', label: 'Work Experience', completed: true, icon: Briefcase },
  { id: 'resume', label: 'Resume Upload', completed: false, icon: FileText },
  { id: 'contact', label: 'Contact Preferences', completed: false, icon: Mail },
];

export function ProfileProgress({ onStepClick, completedOverride }: ProfileProgressProps) {
  const effectiveSteps = profileSteps.map((s) => ({
    ...s,
    completed: completedOverride?.[s.id] ?? s.completed,
  }));
  const completedSteps = effectiveSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / effectiveSteps.length) * 100;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30" />
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <span>Profile Completion</span>
          <motion.span 
            className="text-2xl font-bold text-green-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            {Math.round(progressPercentage)}%
          </motion.span>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedSteps} of {effectiveSteps.length} completed</span>
            <span>{effectiveSteps.length - completedSteps} remaining</span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        <div className="space-y-3">
          {effectiveSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.button
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full text-left flex items-center gap-3 p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  step.completed 
                    ? 'bg-green-50/50 hover:bg-green-100/50' 
                    : 'bg-gray-50/50 hover:bg-gray-100/50'
                }`}
                onClick={() => onStepClick?.(step.id)}
                role="button"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </motion.div>
                
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm ${
                    step.completed ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </span>
                  <Icon className={`w-4 h-4 ${
                    step.completed ? 'text-green-500' : 'text-gray-400'
                  }`} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}