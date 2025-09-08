import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Circle, Flame, Clock, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

import { type Habit } from '../services/habitService';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onIncrementQuantity?: (id: string, increment: number) => void;
}

export function HabitCard({ habit, onComplete, onSkip, onUpdateQuantity, onIncrementQuantity }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onComplete(habit.id);
    setIsCompleting(false);
  };

  // Calculate progress for quantifiable habits
  const calculateProgress = () => {
    if (habit.isQuantifiable && habit.targetQuantity && habit.currentQuantity !== undefined) {
      return Math.min(100, (habit.currentQuantity / habit.targetQuantity) * 100);
    }
    return habit.progress || 0;
  };

  const isQuantifiable = habit.isQuantifiable && habit.targetQuantity && habit.currentQuantity !== undefined;
  const progress = calculateProgress();
  const isCompleted = isQuantifiable ? habit.currentQuantity! >= habit.targetQuantity! : habit.completedToday;

  const handleIncrement = async (increment: number) => {
    if (!onIncrementQuantity) return;
    setIsUpdatingQuantity(true);
    try {
      await onIncrementQuantity(habit.id, increment);
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!onUpdateQuantity) return;
    setIsUpdatingQuantity(true);
    try {
      await onUpdateQuantity(habit.id, Math.max(0, newQuantity));
    } finally {
      setIsUpdatingQuantity(false);
    }
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
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Quantifiable habit progress */}
            {isQuantifiable && (
              <div className="mt-2 text-sm text-muted-foreground">
                {habit.currentQuantity} / {habit.targetQuantity} {habit.unit}
              </div>
            )}
          </div>

          {/* Iterative Completion UI */}
          {isQuantifiable && !isCompleted && (
            <div className="mb-4 space-y-3">
              {/* Quantity Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIncrement(-1)}
                  disabled={isUpdatingQuantity || (habit.currentQuantity || 0) <= 0}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="text-center min-w-[60px]">
                  <span className="text-lg font-semibold">{habit.currentQuantity || 0}</span>
                  <div className="text-xs text-muted-foreground">{habit.unit}</div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIncrement(1)}
                  disabled={isUpdatingQuantity}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Increment Buttons */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIncrement(3)}
                  disabled={isUpdatingQuantity}
                  className="text-xs px-2 py-1"
                >
                  +3
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIncrement(5)}
                  disabled={isUpdatingQuantity}
                  className="text-xs px-2 py-1"
                >
                  +5
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIncrement(10)}
                  disabled={isUpdatingQuantity}
                  className="text-xs px-2 py-1"
                >
                  +10
                </Button>
              </div>
            </div>
          )}

          {/* Completion Celebration */}
          {isCompleted && isQuantifiable && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
            >
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-800">Target Reached! 🎉</p>
              <p className="text-xs text-green-600">
                {habit.currentQuantity} {habit.unit} completed
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isCompleted ? (
              <>
                {isQuantifiable ? (
                  <Button
                    onClick={() => handleIncrement(1)}
                    disabled={isUpdatingQuantity}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {isUpdatingQuantity ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add {habit.unit}
                      </>
                    )}
                  </Button>
                ) : (
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
                )}
                <Button
                  variant="outline"
                  onClick={() => onSkip(habit.id)}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Skip
                </Button>
              </>
            ) : (
              <div className="w-full text-center">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Completed Today!</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}