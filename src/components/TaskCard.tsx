import { motion } from 'framer-motion';
import { Check, Trash2, Clock, Repeat } from 'lucide-react';
import { Task, getPriority, formatDueDate, formatTime } from '@/lib/taskUtils';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const TaskCard = ({ task, onToggle, onDelete, index }: TaskCardProps) => {
  const priority = getPriority(task.dueDate);

  const borderClass = {
    urgent: 'border-l-priority-urgent',
    normal: 'border-l-priority-normal',
    safe: 'border-l-priority-safe',
  }[priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'group relative bg-card rounded-xl shadow-sm border-l-4 p-3',
        'active:scale-[0.98] transition-all duration-200',
        borderClass,
        task.completed && 'opacity-60'
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
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
        
        <button
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-destructive transition-all p-2 -m-1 rounded-lg hover:bg-destructive/10 touch-manipulation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-display font-semibold text-foreground text-base leading-tight mb-1',
        task.completed && 'line-through text-muted-foreground'
      )}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
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
  );
};
