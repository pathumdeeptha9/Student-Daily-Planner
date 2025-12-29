import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, Trash2, Clock, Repeat } from 'lucide-react';
import { Task, getPriority, formatDueDate, formatTime } from '@/lib/taskUtils';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface SwipeableTaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const SWIPE_THRESHOLD = 100;

export const SwipeableTaskCard = ({ task, onToggle, onDelete, index }: SwipeableTaskCardProps) => {
  const priority = getPriority(task.dueDate);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const x = useMotionValue(0);
  
  // Background colors based on swipe direction
  const backgroundLeft = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0],
    ['hsl(var(--destructive))', 'hsl(var(--card))']
  );
  
  const backgroundRight = useTransform(
    x,
    [0, SWIPE_THRESHOLD],
    ['hsl(var(--card))', 'hsl(var(--primary))']
  );

  const leftIconOpacity = useTransform(x, [-SWIPE_THRESHOLD, -30], [1, 0]);
  const rightIconOpacity = useTransform(x, [30, SWIPE_THRESHOLD], [0, 1]);
  const leftIconScale = useTransform(x, [-SWIPE_THRESHOLD, -50], [1, 0.5]);
  const rightIconScale = useTransform(x, [50, SWIPE_THRESHOLD], [0.5, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipe = info.offset.x;
    
    if (swipe < -SWIPE_THRESHOLD) {
      // Swipe left = Delete
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(task.id);
        toast.success('Task deleted', {
          description: task.title,
        });
      }, 200);
    } else if (swipe > SWIPE_THRESHOLD) {
      // Swipe right = Complete
      onToggle(task.id);
      toast.success(task.completed ? 'Task uncompleted' : 'Task completed!', {
        description: task.title,
      });
    }
  };

  const borderClass = {
    urgent: 'border-l-priority-urgent',
    normal: 'border-l-priority-normal',
    safe: 'border-l-priority-safe',
  }[priority];

  if (isDeleting) {
    return (
      <motion.div
        initial={{ height: 'auto', opacity: 1 }}
        animate={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative overflow-hidden rounded-xl"
    >
      {/* Background layers for swipe feedback */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-start pl-4 rounded-xl"
        style={{ backgroundColor: backgroundRight }}
      >
        <motion.div
          style={{ opacity: rightIconOpacity, scale: rightIconScale }}
          className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
        >
          <Check className="w-5 h-5 text-primary-foreground" />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-end pr-4 rounded-xl"
        style={{ backgroundColor: backgroundLeft }}
      >
        <motion.div
          style={{ opacity: leftIconOpacity, scale: leftIconScale }}
          className="w-10 h-10 rounded-full bg-destructive-foreground/20 flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 text-destructive-foreground" />
        </motion.div>
      </motion.div>

      {/* Draggable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ cursor: 'grabbing' }}
        className={cn(
          'relative bg-card rounded-xl shadow-sm border-l-4 p-3 touch-pan-y',
          'active:scale-[0.98] transition-transform duration-200',
          borderClass,
          task.completed && 'opacity-60'
        )}
      >
        {/* Swipe hint indicator */}
        <div className="absolute top-1/2 left-1 -translate-y-1/2 flex gap-0.5 opacity-20">
          <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
          <div className="w-0.5 h-4 bg-muted-foreground rounded-full" />
          <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
        </div>

        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-1.5 ml-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge priority={priority} />
            <CategoryBadge categoryId={task.category} />
            {task.recurrence && task.recurrence !== 'none' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                <Repeat className="w-2.5 h-2.5" />
                {task.recurrence}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={cn(
          'font-display font-semibold text-foreground text-base leading-tight mb-1 ml-3',
          task.completed && 'line-through text-muted-foreground'
        )}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-muted-foreground text-xs line-clamp-2 mb-2 ml-3">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 ml-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{formatDueDate(task.dueDate)}</span>
            <span className="text-muted-foreground/60">•</span>
            <span>{formatTime(task.dueDate)}</span>
          </div>

          <button
            onClick={() => onToggle(task.id)}
            className={cn(
              'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all touch-manipulation',
              task.completed 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-border hover:border-primary active:scale-95'
            )}
          >
            {task.completed && <Check className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
