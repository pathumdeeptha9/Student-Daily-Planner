import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, AlertCircle, Repeat, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TASK_CATEGORIES, CategoryId, RecurrenceType } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  onAdd: (task: { 
    title: string; 
    description?: string; 
    dueDate: string;
    category?: CategoryId;
    recurrence?: RecurrenceType;
  }) => void;
  onCancel: () => void;
}

const RECURRENCE_OPTIONS: { id: RecurrenceType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

export const AddTaskForm = ({ onAdd, onCancel }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<CategoryId | undefined>();
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    if (!date || !time) {
      setError('Please select a due date and time');
      return;
    }

    const dueDate = new Date(`${date}T${time}`).toISOString();
    
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      category,
      recurrence: recurrence !== 'none' ? recurrence : undefined,
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">New Task</h2>
          <p className="text-xs text-muted-foreground">Add a new assignment or deadline</p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-muted transition-colors touch-manipulation">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Task Title *</Label>
          <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., HCI Final Report" className="bg-secondary border-0 h-11 text-sm" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add specific details..." className="bg-secondary border-0 min-h-[80px] text-sm resize-none" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Tag className="w-3 h-3" />Category
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {TASK_CATEGORIES.map((cat) => (
              <button key={cat.id} type="button" onClick={() => setCategory(category === cat.id ? undefined : cat.id)}
                className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all touch-manipulation active:scale-95', category === cat.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>
                <span className={cn('w-2 h-2 rounded-full', cat.color)} />{cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />Due Date *
            </Label>
            <Input id="date" type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className="bg-secondary border-0 h-11 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="time" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3 h-3" />Time *
            </Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-secondary border-0 h-11 text-sm" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Repeat className="w-3 h-3" />Repeat
          </Label>
          <div className="grid grid-cols-4 gap-1.5">
            {RECURRENCE_OPTIONS.map((opt) => (
              <button key={opt.id} type="button" onClick={() => setRecurrence(opt.id)}
                className={cn('py-2 px-2 rounded-lg text-xs font-medium transition-all touch-manipulation active:scale-95', recurrence === opt.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-accent/10 rounded-xl p-3 border border-accent/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground mb-1.5">Smart Priority System</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-priority-urgent" />24h = <span className="font-semibold text-priority-urgent-text">Urgent</span></li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-priority-normal" />7 days = <span className="font-semibold text-priority-normal-text">Normal</span></li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-priority-safe" />&gt;7 days = <span className="font-semibold text-priority-safe-text">Low</span></li>
              </ul>
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}

        <Button type="submit" size="lg" className="w-full h-12 text-sm font-semibold shadow-lg">Save Task</Button>
      </form>
    </motion.div>
  );
};
