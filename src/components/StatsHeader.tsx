import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface StatsHeaderProps {
  urgent: number;
  normal: number;
  safe: number;
  userName?: string;
}

export const StatsHeader = ({ urgent, normal, safe, userName = 'Student' }: StatsHeaderProps) => {
  const total = urgent + normal + safe;
  const navigate = useNavigate();
  
  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-primary text-primary-foreground rounded-b-3xl pb-4 sm:pb-6 pt-4 sm:pt-6 px-4 sm:px-5 shadow-lg">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4 sm:mb-5">
        <div className="min-w-0 flex-1">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-foreground/70 text-xs sm:text-sm"
          >
            {getGreeting()},
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight truncate"
          >
            {userName}
          </motion.h1>
        </div>
        <motion.button 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => navigate('/auth')}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center font-display font-bold text-base sm:text-lg hover:bg-primary-foreground/20 transition-colors flex-shrink-0"
        >
          {userName.slice(0, 2).toUpperCase()}
        </motion.button>
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 sm:gap-3"
      >
        <StatCard 
          count={urgent} 
          label="Urgent" 
          color="urgent"
          delay={0.3}
        />
        <StatCard 
          count={normal} 
          label="Normal" 
          color="normal"
          delay={0.4}
        />
        <StatCard 
          count={safe} 
          label="Safe" 
          color="safe"
          delay={0.5}
        />
      </motion.div>

      {/* Total Summary */}
      {total > 0 && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-primary-foreground/60 text-xs sm:text-sm mt-3 sm:mt-4"
        >
          {total} active task{total !== 1 ? 's' : ''} remaining
        </motion.p>
      )}
    </header>
  );
};

interface StatCardProps {
  count: number;
  label: string;
  color: 'urgent' | 'normal' | 'safe';
  delay: number;
}

const StatCard = ({ count, label, color, delay }: StatCardProps) => {
  const colorClasses = {
    urgent: 'text-priority-urgent',
    normal: 'text-priority-normal',
    safe: 'text-priority-safe',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="flex-1 bg-primary-foreground/10 rounded-xl p-2 sm:p-3 text-center backdrop-blur-sm"
    >
      <span className={`font-display text-xl sm:text-2xl font-bold ${colorClasses[color]}`}>
        {count}
      </span>
      <p className="text-[10px] sm:text-xs text-primary-foreground/70 mt-0.5">{label}</p>
    </motion.div>
  );
};
