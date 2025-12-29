import { motion } from 'framer-motion';
import { Flame, CheckCircle2, TrendingUp, Trophy } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';

export const ProgressView = () => {
  const { getProgressStats, getTaskStats } = useTasks();
  const progress = getProgressStats();
  const stats = getTaskStats();

  const maxCount = Math.max(...progress.completedByDay.map(d => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Progress
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Track your productivity and stay motivated
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-priority-urgent mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Streak</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {progress.streak}
          </p>
          <p className="text-[10px] text-muted-foreground">days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-priority-safe mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Completed</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {progress.totalCompleted}
          </p>
          <p className="text-[10px] text-muted-foreground">tasks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-accent mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Rate</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {progress.completionRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">completion</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl p-3 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-priority-normal mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Active</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {stats.total}
          </p>
          <p className="text-[10px] text-muted-foreground">tasks</p>
        </motion.div>
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl p-4 shadow-sm"
      >
        <h3 className="font-display font-semibold text-foreground text-sm mb-3">
          This Week
        </h3>
        
        <div className="flex items-end justify-between gap-1.5 h-24">
          {progress.completedByDay.map((day, index) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / maxCount) * 100}%` }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                className={cn(
                  'w-full rounded-t-md min-h-[4px]',
                  day.count > 0 ? 'bg-accent' : 'bg-muted'
                )}
              />
              <span className="text-[10px] text-muted-foreground">{day.date}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Motivation Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-accent/10 rounded-xl p-3 border border-accent/20 text-center"
      >
        {progress.streak >= 7 ? (
          <p className="text-xs text-accent font-medium">
            🔥 Amazing! You're on a {progress.streak}-day streak!
          </p>
        ) : progress.streak >= 3 ? (
          <p className="text-xs text-accent font-medium">
            ⭐ Great job! {progress.streak} days and counting!
          </p>
        ) : progress.streak > 0 ? (
          <p className="text-xs text-accent font-medium">
            💪 Nice start! Keep the momentum going!
          </p>
        ) : (
          <p className="text-xs text-muted-foreground font-medium">
            Complete a task to start your streak!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};
