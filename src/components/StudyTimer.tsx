import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type TimerMode = 'focus' | 'break';

const TIMER_PRESETS = {
  focus: 25 * 60, // 25 minutes
  break: 5 * 60,  // 5 minutes
};

export const StudyTimer = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? ((TIMER_PRESETS.focus - timeLeft) / TIMER_PRESETS.focus) * 100
    : ((TIMER_PRESETS.break - timeLeft) / TIMER_PRESETS.break) * 100;

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      toast({
        title: "Focus session complete! 🎉",
        description: "Great work! Time for a short break.",
      });
      setMode('break');
      setTimeLeft(TIMER_PRESETS.break);
    } else {
      toast({
        title: "Break's over!",
        description: "Ready to focus again?",
      });
      setMode('focus');
      setTimeLeft(TIMER_PRESETS.focus);
    }
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_PRESETS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_PRESETS[newMode]);
    setIsRunning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-foreground">
          Study Timer
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pomodoro technique for focused studying
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-1.5 p-1 bg-secondary rounded-xl">
        <button
          onClick={() => switchMode('focus')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg transition-all font-medium text-sm touch-manipulation',
            mode === 'focus' 
              ? 'bg-card shadow-sm text-foreground' 
              : 'text-muted-foreground'
          )}
        >
          <BookOpen className="w-4 h-4" />
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg transition-all font-medium text-sm touch-manipulation',
            mode === 'break' 
              ? 'bg-card shadow-sm text-foreground' 
              : 'text-muted-foreground'
          )}
        >
          <Coffee className="w-4 h-4" />
          Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative flex items-center justify-center py-4">
        {/* Progress Ring */}
        <svg className="w-48 h-48 -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="fill-none stroke-secondary"
            strokeWidth="6"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            className={cn(
              'fill-none',
              mode === 'focus' ? 'stroke-accent' : 'stroke-priority-safe'
            )}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 88}
            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) 
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={timeLeft}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="font-display text-5xl font-bold text-foreground tabular-nums"
            >
              {formatTime(timeLeft)}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-muted-foreground mt-1 capitalize">
            {mode} Mode
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="w-11 h-11 rounded-full touch-manipulation"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <Button
          size="lg"
          onClick={toggleTimer}
          className={cn(
            'w-16 h-16 rounded-full text-lg font-semibold shadow-lg touch-manipulation',
            mode === 'focus' 
              ? 'bg-accent hover:bg-accent/90' 
              : 'bg-priority-safe hover:bg-priority-safe/90'
          )}
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </Button>

        <div className="w-11 h-11" /> {/* Spacer for balance */}
      </div>

      {/* Session Counter */}
      <div className="text-center pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Focus sessions completed today
        </p>
        <p className="font-display text-2xl font-bold text-foreground mt-0.5">
          {sessionsCompleted}
        </p>
      </div>
    </motion.div>
  );
};
