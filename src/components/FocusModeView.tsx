import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Moon, Sun, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type SoundType = 'rain' | 'forest' | 'ocean' | 'cafe' | 'none';

export const FocusModeView = () => {
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [selectedSound, setSelectedSound] = useState<SoundType>('none');
  const [volume, setVolume] = useState([50]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const totalSeconds = minutes * 60 + seconds;
  const maxSeconds = 25 * 60;
  const progress = ((maxSeconds - totalSeconds) / maxSeconds) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, totalSeconds]);

  // Breathing animation cycle
  useEffect(() => {
    if (!isActive) return;
    
    const breathingCycle = () => {
      setBreathingPhase('inhale');
      setTimeout(() => setBreathingPhase('hold'), 4000);
      setTimeout(() => setBreathingPhase('exhale'), 7000);
    };

    breathingCycle();
    const interval = setInterval(breathingCycle, 11000);
    return () => clearInterval(interval);
  }, [isActive]);

  const sounds: { type: SoundType; emoji: string; label: string }[] = [
    { type: 'rain', emoji: '🌧️', label: 'Rain' },
    { type: 'forest', emoji: '🌲', label: 'Forest' },
    { type: 'ocean', emoji: '🌊', label: 'Ocean' },
    { type: 'cafe', emoji: '☕', label: 'Café' },
  ];

  const handleReset = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-[calc(100vh-180px)] flex flex-col ${
        isDarkMode ? 'bg-gradient-to-b from-background to-slate-900/50' : ''
      } rounded-2xl p-4 -mx-3 sm:-mx-4`}
    >
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-9 h-9"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <h1 className="text-lg font-bold text-foreground">Focus Mode</h1>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Timer Circle */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="relative w-56 h-56"
          animate={isActive ? {
            scale: breathingPhase === 'inhale' ? 1.05 : breathingPhase === 'hold' ? 1.05 : 1,
          } : {}}
          transition={{ duration: breathingPhase === 'inhale' ? 4 : breathingPhase === 'hold' ? 3 : 4 }}
        >
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="112"
              cy="112"
              r="100"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={628}
              strokeDashoffset={628 - (628 * progress) / 100}
              initial={{ strokeDashoffset: 628 }}
              animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-bold text-foreground font-mono"
              key={totalSeconds}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {formatTime(minutes, seconds)}
            </motion.span>
            
            {isActive && (
              <motion.p
                className="text-xs text-muted-foreground mt-2 capitalize"
                key={breathingPhase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {breathingPhase === 'inhale' ? 'Breathe in...' : 
                 breathingPhase === 'hold' ? 'Hold...' : 'Breathe out...'}
              </motion.p>
            )}
          </div>

          {/* Pulse Effect */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Play/Pause/Reset */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="w-12 h-12 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              onClick={() => setIsActive(!isActive)}
              className="w-16 h-16 rounded-full"
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>
          </motion.div>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={() => setSelectedSound(selectedSound === 'none' ? 'rain' : 'none')}
          >
            {selectedSound === 'none' ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>

        {/* Sound Selection */}
        <div className="bg-card/50 rounded-xl p-3 space-y-3">
          <p className="text-xs font-medium text-muted-foreground text-center">Ambient Sounds</p>
          <div className="flex justify-center gap-3">
            {sounds.map((sound) => (
              <motion.button
                key={sound.type}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedSound(sound.type)}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-lg ${
                  selectedSound === sound.type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span>{sound.emoji}</span>
              </motion.button>
            ))}
          </div>

          {/* Volume Slider */}
          {selectedSound !== 'none' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 px-2"
            >
              <VolumeX className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
