import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Flag, Tag, Clock, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Task, getPriority, formatDueDate } from '@/lib/taskUtils';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';

interface TaskDetailViewProps {
  task: Task;
  onBack: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskDetailView = ({ task, onBack, onSave, onDelete }: TaskDetailViewProps) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {isEditing ? (
            <Button size="sm" onClick={handleSave} className="gap-1.5">
              <Save className="w-4 h-4" />
              Save
            </Button>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Task Content */}
      <motion.div
        layout
        className="bg-card rounded-2xl p-4 space-y-4 border border-border/50"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Title
          </label>
          {isEditing ? (
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="text-lg font-semibold"
            />
          ) : (
            <h1 className="text-lg font-semibold text-foreground">{task.title}</h1>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Description
          </label>
          {isEditing ? (
            <Textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              placeholder="Add a description..."
              rows={3}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {task.description || 'No description'}
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-3">
          {/* Due Date */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Due Date</span>
            </div>
            <p className="text-sm font-medium">{task.dueDate}</p>
          </div>

          {/* Priority */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Flag className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Priority</span>
            </div>
            <PriorityBadge priority={getPriority(task.dueDate)} />
          </div>

          {/* Category */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Category</span>
            </div>
            {task.category ? (
              <CategoryBadge categoryId={task.category} />
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </div>

          {/* Time Left */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Time Left</span>
            </div>
            <p className="text-sm font-medium">{formatDueDate(task.dueDate)}</p>
          </div>
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`text-sm font-medium ${task.completed ? 'text-green-500' : 'text-amber-500'}`}>
              {task.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Gesture Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-3"
      >
        <p className="text-xs text-muted-foreground">
          Swipe left to delete • Swipe right to complete
        </p>
      </motion.div>
    </motion.div>
  );
};
