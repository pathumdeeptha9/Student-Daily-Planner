import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Moon, Palette, ChevronRight, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ProfileView = () => {
  const [profile, setProfile] = useState({
    name: 'Student User',
    email: 'student@university.edu',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: 'Tasks Completed', value: '47' },
    { label: 'Study Hours', value: '128' },
    { label: 'Current Streak', value: '12 days' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Profile Header */}
      <motion.div
        className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-5 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <motion.div
          className="relative inline-block mb-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Camera className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
        </motion.div>

        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="text-center font-semibold"
            />
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="text-center text-sm"
            />
            <Button size="sm" onClick={() => setIsEditing(false)}>
              Save
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-foreground">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-2"
            >
              Edit Profile
            </Button>
          </>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-3 text-center border border-border/50"
          >
            <p className="text-lg font-bold text-primary">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Settings Sections */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
          Account Settings
        </h2>
        
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          <SettingItem
            icon={<User className="w-4 h-4" />}
            label="Personal Information"
            value="Edit"
          />
          <SettingItem
            icon={<Mail className="w-4 h-4" />}
            label="Email Preferences"
            value="Manage"
          />
          <SettingItem
            icon={<Bell className="w-4 h-4" />}
            label="Notifications"
            value="On"
            hasToggle
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
          Appearance
        </h2>
        
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          <SettingItem
            icon={<Moon className="w-4 h-4" />}
            label="Dark Mode"
            hasToggle
            defaultChecked
          />
          <SettingItem
            icon={<Palette className="w-4 h-4" />}
            label="Theme Color"
            value="Default"
          />
        </div>
      </div>

      {/* Logout */}
      <motion.div
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </motion.div>
    </motion.div>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hasToggle?: boolean;
  defaultChecked?: boolean;
}

const SettingItem = ({ icon, label, value, hasToggle, defaultChecked }: SettingItemProps) => {
  const [checked, setChecked] = useState(defaultChecked || false);

  return (
    <motion.div
      className="flex items-center gap-3 p-3 cursor-pointer"
      whileTap={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
    >
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {hasToggle ? (
        <Switch checked={checked} onCheckedChange={setChecked} />
      ) : (
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{value}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};
