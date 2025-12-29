import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ListTodo, 
  CalendarDays, 
  Settings, 
  Timer, 
  TrendingUp,
  FileText,
  Grid3X3,
  User,
  Bell,
  Trophy,
  Focus,
  StickyNote,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 
  | 'list' 
  | 'calendar' 
  | 'timer' 
  | 'progress' 
  | 'settings'
  | 'task-detail'
  | 'categories'
  | 'profile'
  | 'notifications'
  | 'achievements'
  | 'focus-mode'
  | 'notes'
  | 'help';

interface BottomNavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems = [
  { id: 'list' as ViewType, icon: ListTodo, label: 'Tasks' },
  { id: 'calendar' as ViewType, icon: CalendarDays, label: 'Calendar' },
  { id: 'timer' as ViewType, icon: Timer, label: 'Timer' },
  { id: 'progress' as ViewType, icon: TrendingUp, label: 'Progress' },
  { id: 'notifications' as ViewType, icon: Bell, label: 'Notifications' },
];

const moreItems = [
  { id: 'categories' as ViewType, icon: Grid3X3, label: 'Categories' },
  { id: 'focus-mode' as ViewType, icon: Focus, label: 'Focus' },
  { id: 'achievements' as ViewType, icon: Trophy, label: 'Achievements' },
  { id: 'notes' as ViewType, icon: StickyNote, label: 'Notes' },
  { id: 'profile' as ViewType, icon: User, label: 'Profile' },
  { id: 'help' as ViewType, icon: HelpCircle, label: 'Help' },
  { id: 'settings' as ViewType, icon: Settings, label: 'Settings' },
];

export const BottomNavigation = ({ currentView, onViewChange }: BottomNavigationProps) => {
  const [showMore, setShowMore] = useState(false);
  
  // Check if current view is in the more items
  const isMoreItemActive = moreItems.some(item => item.id === currentView);

  const handleMoreToggle = () => {
    setShowMore(!showMore);
  };

  const handleItemClick = (viewType: ViewType) => {
    onViewChange(viewType);
    if (moreItems.some(item => item.id === viewType)) {
      setShowMore(false);
    }
  };

  return (
    <>
      {/* More Items Overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowMore(false)}
          />
        )}
      </AnimatePresence>

      {/* More Items Panel */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 left-0 right-0 bg-card border-t border-border/50 px-4 py-4 z-50"
          >
            <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
              {moreItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all',
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                    <span className={cn(
                      'text-xs',
                      isActive && 'font-semibold'
                    )}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 px-1 sm:px-2 py-2 safe-area-pb z-30"
      >
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 rounded-xl transition-all min-w-0',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={cn('w-5 h-5 relative z-10 flex-shrink-0', isActive && 'stroke-[2.5]')} />
                <span className={cn(
                  'text-[9px] sm:text-[10px] relative z-10 truncate max-w-full',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* More Button */}
          <button
            onClick={handleMoreToggle}
            className={cn(
              'relative flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 rounded-xl transition-all min-w-0',
              (showMore || isMoreItemActive)
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {(showMore || isMoreItemActive) && (
              <motion.div
                layoutId="navIndicator"
                className="absolute inset-0 bg-primary/10 rounded-xl"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <div className={cn('w-5 h-5 relative z-10 flex-shrink-0 flex items-center justify-center', (showMore || isMoreItemActive) && 'stroke-[2.5]')}>
              <div className="w-1 h-1 bg-current rounded-full" />
              <div className="w-1 h-1 bg-current rounded-full ml-0.5" />
              <div className="w-1 h-1 bg-current rounded-full ml-0.5" />
            </div>
            <span className={cn(
              'text-[9px] sm:text-[10px] relative z-10 truncate max-w-full',
              (showMore || isMoreItemActive) && 'font-semibold'
            )}>
              More
            </span>
          </button>
        </div>
      </motion.nav>
    </>
  );
};
