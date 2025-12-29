import { useState, useEffect } from 'react';
import { Task, getPriority, Priority, getNextRecurrence } from '@/lib/taskUtils';

const STORAGE_KEY = 'student_daily_planner_tasks';
const COMPLETED_STORAGE_KEY = 'student_daily_planner_completed_history';

export interface CompletedTask {
  id: string;
  title: string;
  completedAt: string;
  category?: string;
}

// Sample tasks for demonstration
const getSampleTasks = (): Task[] => {
  const now = new Date();
  
  return [
    {
      id: '1',
      title: 'HCI Final Report',
      description: 'Complete the user research analysis and wireframes section',
      dueDate: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
      completed: false,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'science',
    },
    {
      id: '2',
      title: 'Math Assignment 5',
      description: 'Chapters 8-10 problem sets',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      completed: false,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'math',
      recurrence: 'weekly',
    },
    {
      id: '3',
      title: 'Group Project Presentation',
      description: 'Prepare slides for the semester project',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
      completed: false,
      createdAt: now.toISOString(),
      category: 'english',
    },
    {
      id: '4',
      title: 'Read Research Paper',
      description: 'Review the assigned paper on machine learning ethics',
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
      completed: false,
      createdAt: now.toISOString(),
      category: 'science',
    },
  ];
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : getSampleTasks();
      }
      return getSampleTasks();
    } catch {
      return getSampleTasks();
    }
  });

  const [completedHistory, setCompletedHistory] = useState<CompletedTask[]>(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completedHistory));
  }, [completedHistory]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => {
      return prev.map(t => {
        if (t.id === id) {
          const nowCompleted = !t.completed;
          
          // If completing a recurring task, create next occurrence
          if (nowCompleted && t.recurrence && t.recurrence !== 'none') {
            const nextDueDate = getNextRecurrence(t.dueDate, t.recurrence);
            const newRecurringTask: Task = {
              ...t,
              id: Date.now().toString(),
              dueDate: nextDueDate,
              completed: false,
              createdAt: new Date().toISOString(),
            };
            // Add to tasks after current map completes
            setTimeout(() => {
              setTasks(current => [...current, newRecurringTask]);
            }, 0);
          }
          
          // Track completion history
          if (nowCompleted) {
            setCompletedHistory(prev => [...prev, {
              id: t.id,
              title: t.title,
              completedAt: new Date().toISOString(),
              category: t.category,
            }]);
          }
          
          return { ...t, completed: nowCompleted };
        }
        return t;
      });
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const getFilteredTasks = (filter: 'all' | Priority) => {
    return tasks
      .filter(t => {
        if (filter === 'all') return true;
        return getPriority(t.dueDate) === filter;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getTaskStats = () => {
    const activeTasks = tasks.filter(t => !t.completed);
    return {
      urgent: activeTasks.filter(t => getPriority(t.dueDate) === 'urgent').length,
      normal: activeTasks.filter(t => getPriority(t.dueDate) === 'normal').length,
      safe: activeTasks.filter(t => getPriority(t.dueDate) === 'safe').length,
      total: activeTasks.length,
      completed: tasks.filter(t => t.completed).length,
    };
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const getProgressStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const completedByDay = last7Days.map(date => {
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: completedHistory.filter(t => {
          const completed = new Date(t.completedAt);
          return completed >= date && completed <= dayEnd;
        }).length,
      };
    });

    // Calculate streak
    let streak = 0;
    const checkDate = new Date(today);
    
    while (true) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasCompletion = completedHistory.some(t => {
        const completed = new Date(t.completedAt);
        return completed >= dayStart && completed <= dayEnd;
      });
      
      if (hasCompletion) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const totalCompleted = completedHistory.length;
    const totalTasks = tasks.length + completedHistory.length;
    const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return {
      completedByDay,
      streak,
      totalCompleted,
      completionRate,
    };
  };

  const reorderTasks = (newOrder: Task[]) => {
    setTasks(newOrder);
  };

  return {
    tasks,
    addTask,
    toggleComplete,
    deleteTask,
    updateTask,
    getFilteredTasks,
    getTaskStats,
    getTasksForDate,
    getProgressStats,
    completedHistory,
    reorderTasks,
  };
};
