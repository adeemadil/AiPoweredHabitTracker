import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Circle, Flame, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

import { type Habit } from '../services/habitService';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
}

export function HabitCard({ habit, onComplete, onSkip }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onComplete(habit.id);
    setIsCompleting(false);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-primary';
      case 'weekly': return 'bg-secondary';
      case 'monthly': return 'bg-chart-3';
      default: return 'bg-muted';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{habit.emoji}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{habit.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`${getFrequencyColor(habit.frequency)} text-white border-0`}>
                    {habit.frequency}
                  </Badge>
                  {(habit.currentStreak || habit.streak || 0) > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span>{habit.currentStreak || habit.streak} day streak</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {habit.completedToday && (
              <CheckCircle className="h-6 w-6 text-secondary" />
            )}
          </div>

          {/* Progress Ring */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Today's Progress</span>
              <span className="font-medium">{habit.progress}%</span>
            </div>
            <Progress value={habit.progress} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!habit.completedToday ? (
              <>
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {isCompleting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onSkip(habit.id)}
                  className="flex-1"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Skip
                </Button>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center py-2 text-secondary font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed Today!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}