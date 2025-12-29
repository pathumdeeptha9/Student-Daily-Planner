import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTasks } from '@/hooks/useTasks';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Priority, CategoryId, RecurrenceType } from '@/lib/taskUtils';
import { StatsHeader } from '@/components/StatsHeader';
import { GestureTaskList } from '@/components/GestureTaskList';
import { AddTaskForm } from '@/components/AddTaskForm';
import { CalendarView } from '@/components/CalendarView';
import { SettingsView } from '@/components/SettingsView';
import { StudyTimer } from '@/components/StudyTimer';
import { ProgressView } from '@/components/ProgressView';
import { CategoriesView } from '@/components/CategoriesView';
import { ProfileView } from '@/components/ProfileView';
import { NotificationsView } from '@/components/NotificationsView';
import { AchievementsView } from '@/components/AchievementsView';
import { FocusModeView } from '@/components/FocusModeView';
import { NotesView } from '@/components/NotesView';
import { HelpView } from '@/components/HelpView';
import { TaskDetailView } from '@/components/TaskDetailView';
import { BottomNavigation, ViewType } from '@/components/BottomNavigation';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filter, setFilter] = useState<'all' | Priority>('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  const { showOnboarding, completeOnboarding, resetOnboarding } = useOnboarding();
  const { 
    tasks, 
    addTask, 
    toggleComplete, 
    deleteTask, 
    getFilteredTasks, 
    getTaskStats,
    reorderTasks 
  } = useTasks();

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks(filter);

  const handleAddTask = (taskData: { 
    title: string; 
    description?: string; 
    dueDate: string;
    category?: CategoryId;
    recurrence?: RecurrenceType;
  }) => {
    addTask(taskData);
    setIsAddingTask(false);
  };

  return (
    <>
      <title>Student Daily Planner - Task Manager</title>
      <meta name="description" content="Stay organized with Student Daily Planner, the smart student planner with automatic priority management. Never miss a deadline again." />
      
      <div className="min-h-screen bg-background pb-20">
        {/* Onboarding Modal */}
        <AnimatePresence>
          {showOnboarding && (
            <OnboardingModal onComplete={completeOnboarding} />
          )}
        </AnimatePresence>

        {/* Header - Only show on list view */}
        {currentView === 'list' && !isAddingTask && (
          <StatsHeader 
            urgent={stats.urgent}
            normal={stats.normal}
            safe={stats.safe}
          />
        )}

        {/* Main Content */}
        <main className="px-3 sm:px-4 pt-4 sm:pt-5 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {isAddingTask ? (
              <AddTaskForm 
                onAdd={handleAddTask} 
                onCancel={() => setIsAddingTask(false)} 
              />
            ) : currentView === 'list' ? (
              <GestureTaskList
                tasks={filteredTasks}
                filter={filter}
                onFilterChange={setFilter}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onReorder={reorderTasks}
              />
            ) : currentView === 'calendar' ? (
              <CalendarView 
                tasks={tasks} 
              />
            ) : currentView === 'timer' ? (
              <StudyTimer />
            ) : currentView === 'progress' ? (
              <ProgressView />
            ) : currentView === 'categories' ? (
              <CategoriesView />
            ) : currentView === 'profile' ? (
              <ProfileView />
            ) : currentView === 'notifications' ? (
              <NotificationsView />
            ) : currentView === 'achievements' ? (
              <AchievementsView />
            ) : currentView === 'focus-mode' ? (
              <FocusModeView />
            ) : currentView === 'notes' ? (
              <NotesView />
            ) : currentView === 'help' ? (
              <HelpView />
            ) : currentView === 'task-detail' && selectedTask ? (
              <TaskDetailView 
                task={selectedTask}
                onBack={() => {
                  setCurrentView('list');
                  setSelectedTask(null);
                }}
                onSave={(updatedTask) => {
                  // TODO: Update task in state
                  setCurrentView('list');
                  setSelectedTask(null);
                }}
                onDelete={(taskId) => {
                  deleteTask(taskId);
                  setCurrentView('list');
                  setSelectedTask(null);
                }}
              />
            ) : currentView === 'task-detail' ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No task selected</p>
                <Button onClick={() => setCurrentView('list')} className="mt-4">
                  Go Back to Tasks
                </Button>
              </div>
            ) : (
              <SettingsView 
                onResetOnboarding={resetOnboarding} 
              />
            )}
          </AnimatePresence>
        </main>

        {/* Floating Add Button */}
        {!isAddingTask && currentView === 'list' && (
          <FloatingAddButton onClick={() => setIsAddingTask(true)} />
        )}

        {/* Bottom Navigation */}
        {!isAddingTask && (
          <BottomNavigation 
            currentView={currentView} 
            onViewChange={setCurrentView} 
          />
        )}
      </div>
    </>
  );
};

export default Index;
