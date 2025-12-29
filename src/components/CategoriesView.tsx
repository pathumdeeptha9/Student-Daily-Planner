import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, GripVertical, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TASK_CATEGORIES } from '@/lib/taskUtils';

interface CustomCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const CategoriesView = () => {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const defaultCategories = TASK_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.label,
    color: cat.color,
    icon: '📚',
    isDefault: true,
  }));

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: CustomCategory = {
        id: `custom-${Date.now()}`,
        name: newCategoryName.trim(),
        color: 'hsl(var(--primary))',
        icon: '📝',
      };
      setCustomCategories([...customCategories, newCategory]);
      setNewCategoryName('');
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCustomCategories(customCategories.filter(c => c.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Categories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize your tasks by subject
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Add Category Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-xl p-3 border border-border/50"
          >
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name..."
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={handleAddCategory}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default Categories */}
      <div className="space-y-2">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
          Default Categories
        </h2>
        <div className="space-y-1.5">
          {defaultCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border/50"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.icon}
              </div>
              <span className="flex-1 font-medium text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Default
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom Categories */}
      {customCategories.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Custom Categories
          </h2>
          <Reorder.Group
            axis="y"
            values={customCategories}
            onReorder={setCustomCategories}
            className="space-y-1.5"
          >
            {customCategories.map((category) => (
              <Reorder.Item
                key={category.id}
                value={category}
                className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border/50 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>
                <span className="flex-1 font-medium text-sm">{category.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Gesture Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-4 space-y-1"
      >
        <p className="text-xs text-muted-foreground">
          Drag to reorder custom categories
        </p>
        <p className="text-xs text-muted-foreground/60">
          Long press and drag to rearrange
        </p>
      </motion.div>
    </motion.div>
  );
};
