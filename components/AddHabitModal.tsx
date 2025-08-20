import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Sparkles, Clock, Calendar, Lightbulb, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: { name: string; frequency: string; emoji: string; notes?: string }) => void;
}

interface AISuggestion {
  emoji: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  timeOfDay: string;
  tip: string;
}

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [notes, setNotes] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Common habit emojis
  const popularEmojis = [
    '💧', '🏃‍♂️', '📚', '🧘‍♀️', '📝', '🥗', '💤', '🎯', 
    '📞', '🌱', '🏋️‍♂️', '🎨', '🎵', '☕', '🚶‍♂️', '📊',
    '💡', '🌟', '🔥', '⚡', '💎', '🚀', '🌈', '✨'
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', icon: Calendar, description: 'Every day' },
    { value: 'weekly', label: 'Weekly', icon: Clock, description: '1-2 times per week' },
    { value: 'monthly', label: 'Monthly', icon: Calendar, description: 'Few times per month' }
  ];

  // Simulate AI analysis of habit name
  useEffect(() => {
    if (habitName.length > 3) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        // Mock AI suggestions based on keywords
        const suggestion = generateAIsuggestion(habitName);
        setAiSuggestion(suggestion);
        setSelectedEmoji(suggestion.emoji);
        setIsAnalyzing(false);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setAiSuggestion(null);
      setIsAnalyzing(false);
    }
  }, [habitName]);

  const generateAIsuggestion = (name: string): AISuggestion => {
    const lowerName = name.toLowerCase();
    
    // Simple keyword matching for demo
    if (lowerName.includes('water') || lowerName.includes('drink')) {
      return {
        emoji: '💧',
        frequency: 'daily',
        timeOfDay: 'throughout the day',
        tip: 'Start with a glass first thing in the morning!'
      };
    }
    
    if (lowerName.includes('exercise') || lowerName.includes('workout') || lowerName.includes('run')) {
      return {
        emoji: '🏃‍♂️',
        frequency: 'daily',
        timeOfDay: 'morning',
        tip: 'Morning workouts boost energy for the whole day!'
      };
    }
    
    if (lowerName.includes('read') || lowerName.includes('book')) {
      return {
        emoji: '📚',
        frequency: 'daily',
        timeOfDay: 'evening',
        tip: 'Reading before bed improves sleep quality!'
      };
    }
    
    if (lowerName.includes('meditat') || lowerName.includes('mindful')) {
      return {
        emoji: '🧘‍♀️',
        frequency: 'daily',
        timeOfDay: 'morning',
        tip: 'Even 5 minutes can make a difference!'
      };
    }
    
    if (lowerName.includes('journal') || lowerName.includes('write')) {
      return {
        emoji: '📝',
        frequency: 'daily',
        timeOfDay: 'evening',
        tip: 'Reflect on 3 things you\'re grateful for!'
      };
    }
    
    // Default suggestion
    return {
      emoji: '✨',
      frequency: 'daily',
      timeOfDay: 'morning',
      tip: 'Consistency is key - start small and build up!'
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    onAdd({
      name: habitName.trim(),
      frequency,
      emoji: selectedEmoji,
      notes: notes.trim() || undefined
    });

    // Reset form
    setHabitName('');
    setFrequency('daily');
    setSelectedEmoji('✨');
    setNotes('');
    setAiSuggestion(null);
    onClose();
  };

  const handleClose = () => {
    setHabitName('');
    setFrequency('daily');
    setSelectedEmoji('✨');
    setNotes('');
    setAiSuggestion(null);
    setShowEmojiPicker(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            Create New Habit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name Input */}
          <div className="space-y-2">
            <Label htmlFor="habit-name">What habit would you like to build?</Label>
            <div className="relative">
              <Input
                id="habit-name"
                placeholder="e.g., Drink 8 glasses of water, Exercise for 30 minutes..."
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="text-base pr-10"
                autoFocus
              />
              {isAnalyzing && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Describe your habit in natural language - our AI will help optimize it!
            </p>
          </div>

          {/* AI Suggestion Card */}
          <AnimatePresence>
            {aiSuggestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">AI Suggestion</h4>
                          <Badge variant="secondary" className="text-xs">
                            {aiSuggestion.frequency}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{aiSuggestion.emoji}</span>
                          <p className="text-sm text-muted-foreground">
                            Best results if done in the {aiSuggestion.timeOfDay}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{aiSuggestion.tip}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emoji Selection */}
          <div className="space-y-3">
            <Label>Choose an emoji</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-12 h-12 rounded-lg border border-border flex items-center justify-center text-2xl hover:bg-accent transition-colors"
              >
                {selectedEmoji}
              </button>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {aiSuggestion ? 'AI suggested emoji (click to change)' : 'Click to choose an emoji'}
                </p>
              </div>
            </div>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-sm">Popular choices</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {popularEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setSelectedEmoji(emoji);
                          setShowEmojiPicker(false);
                        }}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg hover:bg-accent transition-colors ${
                          selectedEmoji === emoji ? 'ring-2 ring-primary bg-primary/10' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Frequency Selection */}
          <div className="space-y-3">
            <Label>How often?</Label>
            <div className="grid grid-cols-3 gap-3">
              {frequencyOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFrequency(option.value as 'daily' | 'weekly' | 'monthly')}
                    className={`p-4 rounded-lg border text-left transition-all hover:shadow-sm ${
                      frequency === option.value 
                        ? 'ring-2 ring-primary bg-primary/5 border-primary/20' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                );
              })}
            </div>
            {aiSuggestion && (
              <p className="text-sm text-muted-foreground">
                💡 AI suggests <strong>{aiSuggestion.frequency}</strong> frequency for best results
              </p>
            )}
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details or reminders..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={!habitName.trim()}
            >
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}