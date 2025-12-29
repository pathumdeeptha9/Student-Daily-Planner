import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Target, BookOpen, Clock, Zap, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const AchievementsView = () => {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first task',
      icon: <Star className="w-5 h-5" />,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common',
    },
    {
      id: '2',
      title: 'On Fire',
      description: 'Complete 7 days streak',
      icon: <Flame className="w-5 h-5" />,
      progress: 5,
      maxProgress: 7,
      unlocked: false,
      rarity: 'rare',
    },
    {
      id: '3',
      title: 'Task Master',
      description: 'Complete 50 tasks',
      icon: <Target className="w-5 h-5" />,
      progress: 32,
      maxProgress: 50,
      unlocked: false,
      rarity: 'epic',
    },
    {
      id: '4',
      title: 'Bookworm',
      description: 'Study for 100 hours total',
      icon: <BookOpen className="w-5 h-5" />,
      progress: 67,
      maxProgress: 100,
      unlocked: false,
      rarity: 'legendary',
    },
    {
      id: '5',
      title: 'Early Bird',
      description: 'Complete a task before 8 AM',
      icon: <Clock className="w-5 h-5" />,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common',
    },
    {
      id: '6',
      title: 'Speed Demon',
      description: 'Complete 5 tasks in one day',
      icon: <Zap className="w-5 h-5" />,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: 'rare',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-amber-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-amber-500/10';
      case 'epic':
        return 'bg-purple-500/10';
      case 'rare':
        return 'bg-blue-500/10';
      default:
        return 'bg-muted';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-xl font-bold text-foreground">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          {unlockedCount} of {achievements.length} unlocked
        </p>
        <Progress value={(unlockedCount / achievements.length) * 100} className="h-2 max-w-xs mx-auto" />
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative bg-card rounded-xl p-4 border overflow-hidden ${
              achievement.unlocked
                ? 'border-primary/30'
                : 'border-border/50 opacity-70'
            }`}
          >
            {/* Rarity Indicator */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRarityColor(achievement.rarity)}`} />

            <div className="flex gap-3">
              {/* Icon */}
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRarityBg(achievement.rarity)} ${
                  achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}
                animate={achievement.unlocked ? {
                  boxShadow: ['0 0 0 0 rgba(var(--primary), 0)', '0 0 20px 5px rgba(var(--primary), 0.3)', '0 0 0 0 rgba(var(--primary), 0)'],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {achievement.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {achievement.title}
                  </h3>
                  {achievement.unlocked && (
                    <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
                
                {/* Progress */}
                {!achievement.unlocked && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress
                      value={(achievement.progress / achievement.maxProgress) * 100}
                      className="h-1.5"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Unlock Indicator */}
            {achievement.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Gesture Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-3"
      >
        <p className="text-xs text-muted-foreground">
          Tap achievements to see details
        </p>
      </motion.div>
    </motion.div>
  );
};
