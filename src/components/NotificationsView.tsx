import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Bell, Check, Trash2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'reminder' | 'warning' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const NotificationsView = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Deadline Approaching',
      message: 'Math Assignment is due tomorrow!',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Study Reminder',
      message: 'Time for your scheduled study session',
      time: '4 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Task Completed',
      message: 'Great job! You completed "Read Chapter 5"',
      time: 'Yesterday',
      read: true,
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Weekly Review',
      message: 'Check your progress for this week',
      time: '2 days ago',
      read: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-primary" />;
    }
  };

  const handleSwipe = (id: string, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        // Swipe right - mark as read
        setNotifications(notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ));
      } else {
        // Swipe left - delete
        setNotifications(notifications.filter(n => n.id !== id));
      }
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="text-xs"
        >
          Mark all read
        </Button>
      </div>

      {/* Gesture Guide */}
      <div className="bg-muted/50 rounded-xl p-3 text-center">
        <p className="text-xs text-muted-foreground">
          ← Swipe left to delete • Swipe right to mark read →
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100, height: 0 }}
              transition={{ delay: index * 0.05 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => handleSwipe(notification.id, info)}
              className={`relative bg-card rounded-xl p-3 border cursor-grab active:cursor-grabbing ${
                notification.read
                  ? 'border-border/30 opacity-60'
                  : 'border-border/50'
              }`}
            >
              {/* Swipe Indicators */}
              <div className="absolute inset-y-0 left-0 w-16 bg-green-500/20 rounded-l-xl flex items-center justify-center opacity-0 pointer-events-none">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div className="absolute inset-y-0 right-0 w-16 bg-destructive/20 rounded-r-xl flex items-center justify-center opacity-0 pointer-events-none">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>

              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  notification.type === 'warning'
                    ? 'bg-amber-500/10'
                    : notification.type === 'success'
                    ? 'bg-green-500/10'
                    : 'bg-primary/10'
                }`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">All Caught Up!</h3>
          <p className="text-sm text-muted-foreground">
            No new notifications
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
