import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Target, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Award,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInsightsWidgetProps {
  analytics?: any;
  className?: string;
}

export function AIInsightsWidget({ analytics, className = '' }: AIInsightsWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock analytics data for demonstration
  const mockAnalytics = {
    weeklyCompletion: 78,
    bestStreak: 12,
    currentStreak: 5,
    totalHabits: 8,
    completedToday: 6,
    consistencyScore: 85,
    insights: [
      {
        type: 'pattern',
        message: "You're most consistent on Mondays and Tuesdays!",
        suggestion: "Try scheduling challenging habits early in the week.",
        confidence: 92
      },
      {
        type: 'timing',
        message: "Your morning habits have 89% completion rate.",
        suggestion: "Consider moving evening habits to morning routine.",
        confidence: 85
      },
      {
        type: 'streak',
        message: "You're on track for your longest streak this month!",
        suggestion: "Keep up the momentum - just 3 more days to beat your record.",
        confidence: 78
      }
    ],
    weeklyData: [
      { day: 'Mon', completed: 7, total: 8 },
      { day: 'Tue', completed: 8, total: 8 },
      { day: 'Wed', completed: 6, total: 8 },
      { day: 'Thu', completed: 7, total: 8 },
      { day: 'Fri', completed: 5, total: 8 },
      { day: 'Sat', completed: 8, total: 8 },
      { day: 'Sun', completed: 6, total: 8 }
    ]
  };

  // Merge provided analytics over sensible defaults to avoid undefined fields
  const data = { ...mockAnalytics, ...(analytics || {}) };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <Calendar className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'streak':
        return <Flame className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            AI Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-700">{data.weeklyCompletion}%</span>
            </div>
            <p className="text-xs text-green-600">Weekly completion</p>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-orange-700">{data.currentStreak}</span>
            </div>
            <p className="text-xs text-orange-600">Current streak</p>
          </div>
        </div>

        {/* Progress Visualization - GitHub-style heatmap */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">This week's progress</p>
            <Badge variant="outline" className="text-xs">
              {data.completedToday}/{data.totalHabits} today
            </Badge>
          </div>
          
          <div className="flex justify-between gap-1">
            {(data.weeklyData || []).map((day: any, index: number) => {
              const completionRate = (day.completed / day.total) * 100;
              let bgColor = 'bg-gray-100';
              
              if (completionRate >= 90) bgColor = 'bg-green-500';
              else if (completionRate >= 75) bgColor = 'bg-green-400';
              else if (completionRate >= 50) bgColor = 'bg-green-300';
              else if (completionRate >= 25) bgColor = 'bg-green-200';
              else if (completionRate > 0) bgColor = 'bg-green-100';
              
              return (
                <div key={day.day} className="flex-1 text-center">
                  <div 
                    className={`w-full h-8 rounded-sm ${bgColor} mb-1 transition-all hover:scale-105 cursor-help`}
                    title={`${day.day}: ${day.completed}/${day.total} habits completed`}
                  />
                  <p className="text-xs text-muted-foreground">{day.day}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Insight */}
        {data.insights && data.insights.length > 0 && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 rounded-full">
                {getInsightIcon(data.insights[0].type)}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  {data.insights[0].message}
                </p>
                <p className="text-xs text-blue-700">
                  💡 {data.insights[0].suggestion}
                </p>
                <div className="flex items-center justify-between">
                  <Badge 
                    className={`text-xs ${getConfidenceColor(data.insights[0].confidence)}`}
                  >
                    {data.insights[0].confidence}% confidence
                  </Badge>
                  <motion.div
                    className="flex"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="h-4 w-4 text-blue-500" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Insights */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Consistency Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Consistency Score</p>
                  <Badge variant="secondary">{data.consistencyScore}/100</Badge>
                </div>
                <Progress 
                  value={data.consistencyScore} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  Based on your habit completion patterns over the last 30 days
                </p>
              </div>

              {/* Additional Insights */}
              <div className="space-y-3">
                <p className="text-sm font-medium">More insights</p>
                {data.insights.slice(1).map((insight: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-accent rounded-full mt-0.5">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{insight.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {insight.suggestion}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getConfidenceColor(insight.confidence)}`}
                        >
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievement Section */}
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">Next Milestone</p>
                </div>
                <p className="text-sm text-yellow-700 mb-2">
                  Complete 3 more days to reach a 15-day streak! 🏆
                </p>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-yellow-600 mt-1">
                  12 days progress toward 15-day streak badge
                </p>
              </div>

              {/* View Full Analytics Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Navigate to full analytics page
                }}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Full Analytics
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}