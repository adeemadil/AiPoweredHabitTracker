import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ArrowRight, ArrowLeft, Sparkles, Users, Target, Heart, Brain, Dumbbell, BookOpen, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onComplete: () => void;
}

interface HabitSuggestion {
  id: string;
  name: string;
  emoji: string;
  category: string;
  frequency: 'daily' | 'weekly';
  description: string;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [friendEmail, setFriendEmail] = useState('');

  const focusAreas = [
    { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'from-red-400 to-pink-400' },
    { id: 'productivity', name: 'Productivity', icon: Target, color: 'from-blue-400 to-indigo-400' },
    { id: 'mindfulness', name: 'Mindfulness', icon: Brain, color: 'from-purple-400 to-indigo-400' },
    { id: 'learning', name: 'Learning', icon: BookOpen, color: 'from-green-400 to-teal-400' },
    { id: 'fitness', name: 'Exercise', icon: Dumbbell, color: 'from-orange-400 to-red-400' },
    { id: 'lifestyle', name: 'Lifestyle', icon: Coffee, color: 'from-yellow-400 to-orange-400' },
  ];

  const habitSuggestions: HabitSuggestion[] = [
    { id: '1', name: 'Drink 8 glasses of water', emoji: '💧', category: 'health', frequency: 'daily', description: 'Stay hydrated throughout the day' },
    { id: '2', name: 'Write in journal', emoji: '📝', category: 'mindfulness', frequency: 'daily', description: 'Reflect on your day and thoughts' },
    { id: '3', name: 'Read for 30 minutes', emoji: '📚', category: 'learning', frequency: 'daily', description: 'Expand your knowledge and vocabulary' },
    { id: '4', name: 'Exercise for 30 minutes', emoji: '🏃‍♂️', category: 'fitness', frequency: 'daily', description: 'Keep your body active and healthy' },
    { id: '5', name: 'Meditate for 10 minutes', emoji: '🧘‍♀️', category: 'mindfulness', frequency: 'daily', description: 'Practice mindfulness and reduce stress' },
    { id: '6', name: 'Plan tomorrow\'s tasks', emoji: '📋', category: 'productivity', frequency: 'daily', description: 'Stay organized and focused' },
    { id: '7', name: 'Call a friend or family', emoji: '📞', category: 'lifestyle', frequency: 'weekly', description: 'Maintain social connections' },
    { id: '8', name: 'Learn a new skill', emoji: '🎯', category: 'learning', frequency: 'weekly', description: 'Continuously grow and improve' },
  ];

  const getFilteredHabits = () => {
    if (selectedFocusAreas.length === 0) return habitSuggestions;
    return habitSuggestions.filter(habit => selectedFocusAreas.includes(habit.category));
  };

  const handleFocusAreaToggle = (areaId: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleHabitToggle = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    );
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Welcome to Habitual
                </h1>
                <p className="text-xl text-muted-foreground">
                  Habits made simple, with friends.
                </p>
              </div>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              <div className="grid gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">Track your daily habits with ease</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-sm">Get AI-powered insights and suggestions</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-sm">Stay motivated with friends and cheers</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">What would you like to focus on?</h2>
              <p className="text-muted-foreground">
                Select the areas that matter most to you. We'll suggest relevant habits.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {focusAreas.map((area) => {
                const Icon = area.icon;
                const isSelected = selectedFocusAreas.includes(area.id);
                
                return (
                  <Card
                    key={area.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                    onClick={() => handleFocusAreaToggle(area.id)}
                  >
                    <CardContent className="p-4 text-center space-y-3">
                      <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-medium text-sm">{area.name}</p>
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedFocusAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <h3 className="font-semibold">AI-suggested starter habits:</h3>
                <div className="grid gap-3 max-h-64 overflow-y-auto">
                  {getFilteredHabits().map((habit) => (
                    <Card
                      key={habit.id}
                      className={`cursor-pointer transition-all hover:shadow-sm ${
                        selectedHabits.includes(habit.id) ? 'ring-1 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleHabitToggle(habit.id)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <Checkbox 
                          checked={selectedHabits.includes(habit.id)}
                          onChange={() => handleHabitToggle(habit.id)}
                        />
                        <div className="text-2xl">{habit.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{habit.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {habit.frequency}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{habit.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="social"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Stay motivated together</h2>
              <p className="text-muted-foreground">
                Invite friends to join you on your habit-building journey.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <Card className="p-6 space-y-4">
                <h3 className="font-semibold">Invite a friend</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="friend-email">Friend's email</Label>
                    <Input
                      id="friend-email"
                      type="email"
                      placeholder="friend@example.com"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!friendEmail}
                  >
                    Send invite
                  </Button>
                </div>
              </Card>

              <div className="text-center space-y-4">
                <div className="flex items-center gap-4">
                  <hr className="flex-1" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <hr className="flex-1" />
                </div>
                
                <Button variant="outline" className="w-full">
                  Share invite link
                </Button>
                
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>🎉 <strong>Tip:</strong> Friends can send you "cheers" when you complete habits!</p>
                  <p>📊 Compare streaks and stay motivated together</p>
                </div>
              </div>

              <div className="text-center">
                <Button variant="ghost" onClick={onComplete}>
                  Skip for now
                </Button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="p-8">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 flex items-center gap-2"
                disabled={currentStep === 1 && selectedFocusAreas.length === 0}
              >
                {currentStep === 2 ? 'Get Started' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}