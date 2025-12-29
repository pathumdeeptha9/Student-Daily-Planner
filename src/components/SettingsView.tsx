import { motion } from 'framer-motion';
import { RotateCcw, Info, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsViewProps {
  onResetOnboarding: () => void;
}

export const SettingsView = ({ onResetOnboarding }: SettingsViewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
        <p className="text-xs text-muted-foreground">Customize your experience</p>
      </div>

      {/* Settings Options */}
      <div className="space-y-2">
        {/* Reset Onboarding */}
        <div className="bg-card rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-foreground text-sm">Reset Tutorial</h3>
                <p className="text-xs text-muted-foreground truncate">See the onboarding again</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onResetOnboarding}
              className="text-xs h-8 touch-manipulation"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-xl p-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground text-sm">About Student Daily Planner</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                A smart student planner with automatic priority management. 
                Tasks are color-coded based on their due dates.
              </p>
            </div>
          </div>
        </div>

        {/* Priority Legend */}
        <div className="bg-card rounded-xl p-3 shadow-sm">
          <h3 className="font-medium text-foreground text-sm mb-2.5">Priority Colors</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-priority-urgent" />
              <div>
                <span className="font-medium text-xs text-foreground">Urgent (Red)</span>
                <p className="text-[10px] text-muted-foreground">Due within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-priority-normal" />
              <div>
                <span className="font-medium text-xs text-foreground">Normal (Yellow)</span>
                <p className="text-[10px] text-muted-foreground">Due within 7 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-priority-safe" />
              <div>
                <span className="font-medium text-xs text-foreground">Low Priority (Green)</span>
                <p className="text-[10px] text-muted-foreground">Due after 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-priority-urgent fill-priority-urgent" /> for students
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          Student Daily Planner v1.0
        </p>
      </div>
    </motion.div>
  );
};
