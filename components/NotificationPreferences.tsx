import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Bell, Clock, Smartphone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { habitService, type Habit } from '../services/habitService';

interface NotificationPreferencesProps {
  habits: Habit[];
}

interface NotificationSettings {
  [habitId: string]: {
    enabled: boolean;
    timing: 'morning' | 'afternoon' | 'evening';
    customTime?: string;
  };
}

export function NotificationPreferences({ habits }: NotificationPreferencesProps) {
  const [settings, setSettings] = useState<NotificationSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadNotificationSettings();
  }, [habits]);

  const loadNotificationSettings = async () => {
    try {
      setIsLoading(true);
      // Initialize default settings for each habit
      const defaultSettings: NotificationSettings = {};
      habits.forEach(habit => {
        defaultSettings[habit.id] = {
          enabled: false,
          timing: 'morning',
        };
      });
      
      // In a real app, we'd load saved settings from the backend
      // For now, we'll use localStorage
      const saved = localStorage.getItem('notification-settings');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...savedSettings });
      } else {
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.error('Load notification settings error:', err);
      setError('Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      // In a real app, we'd save to backend
      // For now, save to localStorage
      localStorage.setItem('notification-settings', JSON.stringify(settings));
      
      setSuccessMessage('Notification preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Save notification settings error:', err);
      setError('Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateHabitSetting = (habitId: string, key: keyof NotificationSettings[string], value: any) => {
    setSettings(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [key]: value,
      }
    }));
  };

  const getTimingLabel = (timing: string) => {
    switch (timing) {
      case 'morning': return { label: '9:00 AM', desc: 'Start your day right' };
      case 'afternoon': return { label: '2:00 PM', desc: 'Midday motivation' };
      case 'evening': return { label: '7:00 PM', desc: 'Wind down routine' };
      default: return { label: '9:00 AM', desc: 'Start your day right' };
    }
  };

  const getPreviewNotification = (habit: Habit) => {
    const timing = settings[habit.id]?.timing || 'morning';
    const timeInfo = getTimingLabel(timing);
    
    return {
      title: `⏰ Reminder: ${habit.name}`,
      message: `Time for your ${habit.name.toLowerCase()}! Keep your ${habit.currentStreak} day streak going! 🔥`,
      time: timeInfo.label
    };
  };

  const enabledCount = Object.values(settings).filter(s => s.enabled).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <h2>Notification Preferences</h2>
            <p className="text-muted-foreground">Loading your settings...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-full">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2>Notification Preferences</h2>
          <p className="text-muted-foreground">
            {enabledCount > 0 
              ? `${enabledCount} habit${enabledCount > 1 ? 's' : ''} with reminders enabled`
              : 'Set up reminders to stay on track'
            }
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🔔</div>
              <h3>No habits to notify about</h3>
              <p className="text-muted-foreground">
                Add some habits first, then come back to set up reminders!
              </p>
            </CardContent>
          </Card>
        ) : (
          habits.map(habit => {
            const habitSettings = settings[habit.id];
            const preview = getPreviewNotification(habit);
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`transition-all duration-200 ${
                  habitSettings?.enabled 
                    ? 'ring-1 ring-primary/20 bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Habit Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{habit.emoji}</span>
                        <div>
                          <Label className="font-medium">{habit.name}</Label>
                          <p className="text-sm text-muted-foreground">
                            {habit.frequency === 'daily' ? 'Daily habit' : `${habit.frequency} habit`}
                            {habit.currentStreak > 0 && (
                              <span className="ml-2">
                                🔥 {habit.currentStreak} day streak
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <Switch
                        checked={habitSettings?.enabled || false}
                        onCheckedChange={(enabled: boolean) => 
                          updateHabitSetting(habit.id, 'enabled', enabled)
                        }
                      />
                    </div>

                    {/* Expanded Settings */}
                    {habitSettings?.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <div className="space-y-4">
                          {/* Timing Selection */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              Reminder Time
                            </Label>
                            <Select
                              value={habitSettings.timing}
                              onValueChange={(value: string) => 
                                updateHabitSetting(habit.id, 'timing', value as 'morning' | 'afternoon' | 'evening')
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="morning">
                                  <div className="flex items-center justify-between w-full">
                                    <span>Morning</span>
                                    <Badge variant="outline" className="ml-2">9:00 AM</Badge>
                                  </div>
                                </SelectItem>
                                <SelectItem value="afternoon">
                                  <div className="flex items-center justify-between w-full">
                                    <span>Afternoon</span>
                                    <Badge variant="outline" className="ml-2">2:00 PM</Badge>
                                  </div>
                                </SelectItem>
                                <SelectItem value="evening">
                                  <div className="flex items-center justify-between w-full">
                                    <span>Evening</span>
                                    <Badge variant="outline" className="ml-2">7:00 PM</Badge>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              {getTimingLabel(habitSettings.timing).desc}
                            </p>
                          </div>

                          {/* Preview Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(showPreview === habit.id ? null : habit.id)}
                            className="w-full flex items-center gap-2"
                          >
                            <Smartphone className="h-3 w-3" />
                            {showPreview === habit.id ? 'Hide Preview' : 'Preview Notification'}
                          </Button>

                          {/* Notification Preview */}
                          {showPreview === habit.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-muted/50 rounded-lg p-4 border border-border"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-primary-foreground text-sm font-bold">H</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm">Habitual</p>
                                    <p className="text-xs text-muted-foreground">{preview.time}</p>
                                  </div>
                                  <p className="text-sm font-medium mt-1">{preview.title}</p>
                                  <p className="text-sm text-muted-foreground">{preview.message}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Save Button */}
      {habits.length > 0 && (
        <div className="sticky bottom-4 bg-background/95 backdrop-blur p-4 -mx-4 border-t border-border">
          <Button
            onClick={saveNotificationSettings}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      )}

      {/* Helpful Info */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Enable browser notifications to receive reminders even when Habitual is closed. 
                You'll be prompted to allow notifications when you save your preferences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}