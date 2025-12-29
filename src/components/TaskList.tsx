import { motion, AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { Task, Priority } from '@/lib/taskUtils';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  filter: 'all' | Priority;
  onFilterChange: (filter: 'all' | Priority) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const filters: { id: 'all' | Priority; label: string }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'normal', label: 'Normal' },
  { id: 'safe', label: 'Low Priority' },
];

export const TaskList = ({ 
  tasks, 
  filter, 
  onFilterChange, 
  onToggle, 
  onDelete 
}: TaskListProps) => {
  return (
    <div className="space-y-3">
      {/* Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`
              px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap
              transition-all duration-200 touch-manipulation active:scale-95
              ${filter === f.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-secondary text-secondary-foreground active:bg-secondary/80'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
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
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                index={index}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
