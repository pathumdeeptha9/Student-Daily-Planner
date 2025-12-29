export type Priority = 'urgent' | 'normal' | 'safe';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export const TASK_CATEGORIES = [
  { id: 'math', label: 'Math', color: 'bg-blue-500' },
  { id: 'science', label: 'Science', color: 'bg-emerald-500' },
  { id: 'english', label: 'English', color: 'bg-purple-500' },
  { id: 'history', label: 'History', color: 'bg-amber-500' },
  { id: 'art', label: 'Art', color: 'bg-pink-500' },
  { id: 'other', label: 'Other', color: 'bg-slate-500' },
] as const;

export type CategoryId = typeof TASK_CATEGORIES[number]['id'];

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  category?: CategoryId;
  recurrence?: RecurrenceType;
}

export const getPriority = (dueDateStr: string): Priority => {
  const now = new Date();
  const due = new Date(dueDateStr);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1) return 'urgent';   // Red: Due within 24 hours
  if (diffDays <= 7) return 'normal';  // Yellow: Due within a week
  return 'safe';                       // Green: Longer term
};

export const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'normal': return 'Normal';
    case 'safe': return 'Low Priority';
  }
};

export const getPriorityDescription = (priority: Priority): string => {
  switch (priority) {
    case 'urgent': return 'Due within 24 hours';
    case 'normal': return 'Due within a week';
    case 'safe': return 'More than a week away';
  }
};

export const formatDueDate = (dueDateStr: string): string => {
  const due = new Date(dueDateStr);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `${diffDays} days left`;
  
  return due.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (dueDateStr: string): string => {
  const due = new Date(dueDateStr);
  return due.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const getCategoryById = (id?: CategoryId) => {
  return TASK_CATEGORIES.find(c => c.id === id);
};

export const getNextRecurrence = (dueDate: string, recurrence: RecurrenceType): string => {
  const date = new Date(dueDate);
  switch (recurrence) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      return dueDate;
  }
  return date.toISOString();
};
