import { Priority, getPriorityLabel } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
  size?: 'sm' | 'md';
}

export const PriorityBadge = ({ priority, className, size = 'sm' }: PriorityBadgeProps) => {
  const baseClasses = 'inline-flex items-center font-semibold uppercase tracking-wider rounded-full';
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  const priorityClasses = {
    urgent: 'bg-priority-urgent-bg text-priority-urgent-text',
    normal: 'bg-priority-normal-bg text-priority-normal-text',
    safe: 'bg-priority-safe-bg text-priority-safe-text',
  };

  return (
    <span className={cn(baseClasses, sizeClasses[size], priorityClasses[priority], className)}>
      {getPriorityLabel(priority)}
    </span>
  );
};
