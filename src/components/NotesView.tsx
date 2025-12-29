import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Search, Pin, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: Date;
}

const colors = [
  'bg-amber-500/20',
  'bg-blue-500/20',
  'bg-green-500/20',
  'bg-purple-500/20',
  'bg-pink-500/20',
  'bg-cyan-500/20',
];

export const NotesView = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Study Tips',
      content: 'Use Pomodoro technique for better focus. Take breaks every 25 minutes.',
      color: 'bg-amber-500/20',
      pinned: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Exam Schedule',
      content: 'Math - Monday\nPhysics - Wednesday\nChemistry - Friday',
      color: 'bg-blue-500/20',
      pinned: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Project Ideas',
      content: 'Research topic for thesis. Check library resources.',
      color: 'bg-green-500/20',
      pinned: false,
      createdAt: new Date(),
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: colors[0] });

  const handleAddNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title || 'Untitled',
        content: newNote.content,
        color: newNote.color,
        pinned: false,
        createdAt: new Date(),
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', color: colors[0] });
      setIsAdding(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, pinned: !n.pinned } : n
    ));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Quick Notes</h1>
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="pl-9"
        />
      </div>

      {/* Add Note Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${newNote.color} rounded-xl p-3 space-y-2 border border-border/50`}
          >
            <Input
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Title..."
              className="bg-transparent border-none font-semibold"
            />
            <Textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Write your note..."
              className="bg-transparent border-none resize-none min-h-[80px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewNote({ ...newNote, color })}
                    className={`w-6 h-6 rounded-full ${color} ${
                      newNote.color === color ? 'ring-2 ring-primary' : ''
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddNote}>
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 flex items-center gap-1">
            <Pin className="w-3 h-3" /> Pinned
          </h2>
          <div className="grid gap-2">
            {pinnedNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes */}
      {unpinnedNotes.length > 0 && (
        <div className="space-y-2">
          {pinnedNotes.length > 0 && (
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
              Others
            </h2>
          )}
          <Reorder.Group
            axis="y"
            values={unpinnedNotes}
            onReorder={(newOrder) => setNotes([...pinnedNotes, ...newOrder])}
            className="grid gap-2"
          >
            {unpinnedNotes.map((note, index) => (
              <Reorder.Item key={note.id} value={note}>
                <NoteCard
                  note={note}
                  index={index}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  draggable
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-sm text-muted-foreground">No notes found</p>
        </motion.div>
      )}

      {/* Gesture Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-3"
      >
        <p className="text-xs text-muted-foreground">
          Drag to reorder • Long press to pin
        </p>
      </motion.div>
    </motion.div>
  );
};

interface NoteCardProps {
  note: Note;
  index: number;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  draggable?: boolean;
}

const NoteCard = ({ note, index, onDelete, onTogglePin, draggable }: NoteCardProps) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${note.color} rounded-xl p-3 border border-border/30 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      onTouchStart={() => setTimeout(() => setShowActions(true), 500)}
      onTouchEnd={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">{note.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{note.content}</p>
        </div>
        <div className="flex items-center gap-1">
          {note.pinned && (
            <Pin className="w-3 h-3 text-primary" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mt-2 pt-2 border-t border-border/30"
          >
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-8 text-xs gap-1"
              onClick={() => onTogglePin(note.id)}
            >
              <Pin className="w-3 h-3" />
              {note.pinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-8 text-xs gap-1 text-destructive"
              onClick={() => onDelete(note.id)}
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
