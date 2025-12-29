import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Inbox, GripVertical, RefreshCw } from 'lucide-react';
import { Task, Priority, getPriority } from '@/lib/taskUtils';
import { SwipeableTaskCard } from './SwipeableTaskCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GestureTaskListProps {
  tasks: Task[];
  filter: 'all' | Priority;
  onFilterChange: (filter: 'all' | Priority) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (tasks: Task[]) => void;
}

const filters: { id: 'all' | Priority; label: string }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'normal', label: 'Normal' },
  { id: 'safe', label: 'Low Priority' },
];

export const GestureTaskList = ({ 
  tasks, 
  filter, 
  onFilterChange, 
  onToggle, 
  onDelete,
  onReorder 
}: GestureTaskListProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [orderedTasks, setOrderedTasks] = useState<Task[]>(tasks);

  // Sync with parent tasks
  useState(() => {
    setOrderedTasks(tasks);
  });

  const handlePullStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const container = e.currentTarget as HTMLElement;
    if (container.scrollTop === 0) {
      setPullDistance(0);
    }
  }, []);

  const handlePull = useCallback((e: React.TouchEvent) => {
    const container = e.currentTarget as HTMLElement;
    if (container.scrollTop === 0 && !isRefreshing) {
      const touch = e.touches[0];
      const startY = container.getBoundingClientRect().top;
      const currentY = touch.clientY - startY;
      
      if (currentY > 0 && currentY < 150) {
        setPullDistance(currentY);
      }
    }
  }, [isRefreshing]);

  const handlePullEnd = useCallback(() => {
    if (pullDistance > 80 && !isRefreshing) {
      setIsRefreshing(true);
      toast.info('Refreshing tasks...');
      
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        toast.success('Tasks refreshed!');
      }, 1000);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, isRefreshing]);

  const handleReorder = useCallback((newOrder: Task[]) => {
    setOrderedTasks(newOrder);
    onReorder?.(newOrder);
  }, [onReorder]);

  // Filter tasks for display
  const filteredTasks = orderedTasks.filter(t => {
    if (filter === 'all') return true;
    return getPriority(t.dueDate) === filter;
  });

  return (
    <div className="space-y-3">
      {/* Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={cn(
              'px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap',
              'transition-all duration-200 touch-manipulation active:scale-95',
              filter === f.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-secondary text-secondary-foreground active:bg-secondary/80'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gesture Hint */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground bg-muted/50 rounded-lg py-2 px-3"
      >
        <span className="flex items-center gap-1">
          <motion.span 
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
          Complete
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <motion.span 
            animate={{ x: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ←
          </motion.span>
          Delete
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          Drag
        </span>
      </motion.div>

      {/* Pull to Refresh Indicator */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isRefreshing ? 50 : pullDistance * 0.5, 
          opacity: pullDistance > 20 || isRefreshing ? 1 : 0 
        }}
        className="flex items-center justify-center overflow-hidden"
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
          transition={isRefreshing ? { repeat: Infinity, duration: 0.8 } : { duration: 0 }}
        >
          <RefreshCw className={cn(
            'w-5 h-5 text-primary',
            pullDistance > 80 && 'text-green-500'
          )} />
        </motion.div>
        <span className="ml-2 text-xs text-muted-foreground">
          {isRefreshing ? 'Refreshing...' : pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </motion.div>

      {/* Task List with Reorder */}
      <div
        onTouchStart={handlePullStart}
        onTouchMove={handlePull}
        onTouchEnd={handlePullEnd}
        className="min-h-[200px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Inbox className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">
                No tasks found
              </h3>
              <p className="text-xs text-muted-foreground">
                Tap the + button to add your first task
              </p>
            </motion.div>
          ) : (
            <Reorder.Group 
              axis="y" 
              values={filteredTasks} 
              onReorder={handleReorder}
              className="space-y-2"
            >
              {filteredTasks.map((task, index) => (
                <Reorder.Item
                  key={task.id}
                  value={task}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <SwipeableTaskCard
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    index={index}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
