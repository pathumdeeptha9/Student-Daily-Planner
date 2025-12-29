import { cn } from '@/lib/utils';
import { getCategoryById, CategoryId } from '@/lib/taskUtils';

interface CategoryBadgeProps {
  categoryId?: CategoryId;
  size?: 'sm' | 'md';
}

export const CategoryBadge = ({ categoryId, size = 'sm' }: CategoryBadgeProps) => {
  const category = getCategoryById(categoryId);
  
  if (!category) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        'bg-muted text-muted-foreground'
      )}
    >
      <span className={cn('rounded-full', category.color, size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5')} />
      {category.label}
    </span>
  );
};
