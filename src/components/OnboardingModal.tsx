import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingModalProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Student Daily Planner',
    subtitle: 'Your Smart Student Planner',
    description: 'Stay organized with automatic priority management. Never miss a deadline again.',
    visual: '📚',
  },
  {
    title: 'Smart Color System',
    subtitle: 'Priorities at a glance',
    description: 'Tasks automatically change color based on urgency. No manual sorting needed.',
    visual: 'colors',
  },
  {
    title: 'Ready to Start',
    subtitle: 'Add your first task',
    description: 'Tap the + button to add assignments, exams, and projects. We\'ll handle the rest.',
    visual: '✨',
  },
];

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm"
      >
        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Visual */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center"
            >
              {step.visual === 'colors' ? (
                <div className="space-y-3 py-4">
                  <PriorityRow color="urgent" label="URGENT" desc="Due within 24 hours" />
                  <PriorityRow color="normal" label="NORMAL" desc="Due within a week" />
                  <PriorityRow color="safe" label="LOW" desc="More than a week away" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
                  <span className="text-5xl">{step.visual}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center gap-2 text-accent text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {step.subtitle}
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                {step.title}
              </h2>
              <p className="text-muted-foreground text-base max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 py-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentStep 
                    ? 'w-6 bg-primary' 
                    : index < currentStep 
                      ? 'bg-primary/50' 
                      : 'bg-muted'
                  }
                `}
              />
            ))}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full h-14 text-base font-semibold shadow-lg gap-2"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Get Started
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface PriorityRowProps {
  color: 'urgent' | 'normal' | 'safe';
  label: string;
  desc: string;
}

const PriorityRow = ({ color, label, desc }: PriorityRowProps) => {
  const colorClasses = {
    urgent: 'bg-priority-urgent',
    normal: 'bg-priority-normal',
    safe: 'bg-priority-safe',
  };

  const textClasses = {
    urgent: 'text-priority-urgent-text',
    normal: 'text-priority-normal-text',
    safe: 'text-priority-safe-text',
  };

  const bgClasses = {
    urgent: 'bg-priority-urgent-bg',
    normal: 'bg-priority-normal-bg',
    safe: 'bg-priority-safe-bg',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: color === 'urgent' ? 0 : color === 'normal' ? 0.1 : 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bgClasses[color]}`}
    >
      <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`} />
      <div className="text-left">
        <span className={`font-semibold text-sm ${textClasses[color]}`}>{label}</span>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </motion.div>
  );
};
