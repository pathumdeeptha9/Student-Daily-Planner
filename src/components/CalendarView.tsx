import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, getPriority, Priority } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  onSelectDate?: (date: Date) => void;
}

export const CalendarView = ({ tasks, onSelectDate }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === currentDate.getFullYear() &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getDate() === day
      );
    });
  };

  const getPriorityDots = (dayTasks: Task[]) => {
    const priorities = new Set<Priority>();
    dayTasks.forEach(task => {
      if (!task.completed) {
        priorities.add(getPriority(task.dueDate));
      }
    });
    return Array.from(priorities);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number) => {
    return selectedDate && 
      selectedDate.getFullYear() === currentDate.getFullYear() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === day;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-muted transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {monthName}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-muted transition-colors touch-manipulation"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-medium text-muted-foreground py-1.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayTasks = getTasksForDay(day);
          const priorityDots = getPriorityDots(dayTasks);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all touch-manipulation',
                'active:scale-95',
                isToday(day) && 'bg-primary text-primary-foreground',
                isSelected(day) && !isToday(day) && 'ring-2 ring-primary bg-primary/10'
              )}
            >
              <span className={cn(
                'text-xs font-medium',
                isToday(day) ? 'text-primary-foreground' : 'text-foreground'
              )}>
                {day}
              </span>
              
              {/* Priority Dots */}
              {priorityDots.length > 0 && (
                <div className="flex gap-0.5">
                  {priorityDots.map(priority => (
                    <span
                      key={priority}
                      className={cn(
                        'w-1 h-1 rounded-full',
                        priority === 'urgent' && 'bg-priority-urgent',
                        priority === 'normal' && 'bg-priority-normal',
                        priority === 'safe' && 'bg-priority-safe'
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Tasks */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-border"
        >
          <h3 className="font-display font-semibold text-foreground text-sm mb-2">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </h3>
          
          {getTasksForDay(selectedDate.getDate()).length === 0 ? (
            <p className="text-xs text-muted-foreground">No tasks for this day</p>
          ) : (
            <div className="space-y-1.5">
              {getTasksForDay(selectedDate.getDate()).map(task => {
                const priority = getPriority(task.dueDate);
                return (
                  <div 
                    key={task.id}
                    className={cn(
                      'p-2.5 rounded-lg border-l-4',
                      priority === 'urgent' && 'bg-priority-urgent-bg border-l-priority-urgent',
                      priority === 'normal' && 'bg-priority-normal-bg border-l-priority-normal',
                      priority === 'safe' && 'bg-priority-safe-bg border-l-priority-safe',
                      task.completed && 'opacity-50'
                    )}
                  >
                    <p className={cn(
                      'font-medium text-xs',
                      task.completed && 'line-through'
                    )}>
                      {task.title}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
