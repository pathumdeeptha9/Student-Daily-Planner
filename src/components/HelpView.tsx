import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronRight, 
  Hand, 
  GripVertical,
  MousePointerClick,
  Smartphone,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  demo?: React.ReactNode;
}

export const HelpView = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState<string | null>(null);

  const gestureGuides: HelpItem[] = [
    {
      id: 'swipe-complete',
      title: 'Swipe Right to Complete',
      description: 'Swipe a task to the right to mark it as complete. A green checkmark will appear indicating success.',
      icon: <ChevronRight className="w-5 h-5" />,
      demo: (
        <SwipeDemo direction="right" color="green" label="Complete" />
      ),
    },
    {
      id: 'swipe-delete',
      title: 'Swipe Left to Delete',
      description: 'Swipe a task to the left to delete it. A red trash icon will appear before deletion.',
      icon: <ChevronRight className="w-5 h-5 rotate-180" />,
      demo: (
        <SwipeDemo direction="left" color="red" label="Delete" />
      ),
    },
    {
      id: 'drag-reorder',
      title: 'Drag to Reorder',
      description: 'Press and hold a task, then drag it up or down to change its position in the list.',
      icon: <GripVertical className="w-5 h-5" />,
      demo: (
        <DragDemo />
      ),
    },
    {
      id: 'pull-refresh',
      title: 'Pull to Refresh',
      description: 'Pull down on the task list to refresh and update your tasks.',
      icon: <Hand className="w-5 h-5" />,
      demo: (
        <PullDemo />
      ),
    },
    {
      id: 'tap-details',
      title: 'Tap for Details',
      description: 'Tap on any task to view its full details and edit information.',
      icon: <MousePointerClick className="w-5 h-5" />,
    },
    {
      id: 'long-press',
      title: 'Long Press Actions',
      description: 'Long press on items to reveal additional actions like pin, edit, or share.',
      icon: <Smartphone className="w-5 h-5" />,
    },
  ];

  const faqItems = [
    {
      question: 'How do I add a new task?',
      answer: 'Tap the + button at the bottom right of the screen to add a new task.',
    },
    {
      question: 'Can I undo a deleted task?',
      answer: 'Currently, deleted tasks cannot be recovered. Use swipe carefully!',
    },
    {
      question: 'How does the study timer work?',
      answer: 'The study timer uses the Pomodoro technique - 25 minutes of focus followed by a 5 minute break.',
    },
    {
      question: 'How are priorities assigned?',
      answer: 'Priorities are automatically calculated based on due date. Closer deadlines = higher priority.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"
          whileHover={{ rotate: 15 }}
        >
          <HelpCircle className="w-7 h-7 text-primary" />
        </motion.div>
        <h1 className="text-xl font-bold text-foreground">Help & Gestures</h1>
        <p className="text-xs text-muted-foreground">
          Learn how to use gesture interactions
        </p>
      </div>

      {/* Gesture Guides */}
      <div className="space-y-2">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
          Gesture Controls
        </h2>
        <div className="space-y-2">
          {gestureGuides.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border/50 overflow-hidden"
            >
              <motion.button
                className="w-full p-3 flex items-center gap-3 text-left"
                onClick={() => {
                  setExpandedItem(expandedItem === item.id ? null : item.id);
                  setShowDemo(null);
                }}
                whileTap={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                </div>
                <motion.div
                  animate={{ rotate: expandedItem === item.id ? 90 : 0 }}
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3"
                  >
                    <p className="text-xs text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    {item.demo && (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDemo(showDemo === item.id ? null : item.id)}
                          className="w-full text-xs"
                        >
                          {showDemo === item.id ? 'Hide Demo' : 'Show Demo'}
                        </Button>
                        <AnimatePresence>
                          {showDemo === item.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              {item.demo}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-2">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 flex items-center gap-1">
          <MessageCircle className="w-3 h-3" /> FAQ
        </h2>
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-card rounded-xl p-3 border border-border/50"
            >
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {item.question}
              </h3>
              <p className="text-xs text-muted-foreground">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Demo Components
const SwipeDemo = ({ direction, color, label }: { direction: 'left' | 'right'; color: string; label: string }) => (
  <div className="bg-muted/50 rounded-lg p-4 relative overflow-hidden">
    <motion.div
      className="bg-card rounded-lg p-3 shadow-sm relative z-10"
      animate={{
        x: [0, direction === 'right' ? 50 : -50, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
        <div className="h-2 bg-muted-foreground/30 rounded flex-1" />
      </div>
    </motion.div>
    <motion.div
      className={`absolute ${direction === 'right' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-xs font-medium ${
        color === 'green' ? 'text-green-500' : 'text-destructive'
      }`}
      animate={{
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    >
      {label}
    </motion.div>
  </div>
);

const DragDemo = () => (
  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="bg-card rounded-lg p-2 shadow-sm flex items-center gap-2"
        animate={i === 2 ? {
          y: [0, -24, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <GripVertical className="w-3 h-3 text-muted-foreground" />
        <div className="h-2 bg-muted-foreground/30 rounded flex-1" />
      </motion.div>
    ))}
  </div>
);

const PullDemo = () => (
  <div className="bg-muted/50 rounded-lg p-4 relative overflow-hidden">
    <motion.div
      className="space-y-2"
      animate={{
        y: [0, 20, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    >
      <motion.div
        className="w-6 h-6 mx-auto rounded-full border-2 border-primary border-t-transparent"
        animate={{
          rotate: [0, 360],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-lg p-2 shadow-sm">
          <div className="h-2 bg-muted-foreground/30 rounded" />
        </div>
      ))}
    </motion.div>
  </div>
);
