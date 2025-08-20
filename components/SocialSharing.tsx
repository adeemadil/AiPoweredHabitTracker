import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Share2, 
  Download, 
  Trophy, 
  TrendingUp, 
  Users, 
  Crown,
  Medal,
  Award,
  Instagram,
  MessageCircle,
  Twitter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type Habit } from '../services/habitService';

interface SocialSharingProps {
  habits: Habit[];
  analytics: any;
  user: any;
}

interface ShareCardProps {
  user: any;
  habits: Habit[];
  analytics: any;
}

const ShareCard = ({ user, habits, analytics }: ShareCardProps) => {
  const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;
  const longestStreak = Math.max(...habits.map(h => h.currentStreak), 0);
  
  // Generate motivational message based on performance
  const generateMotivationalMessage = () => {
    if (completionRate === 100) return "Crushing it today! 💯";
    if (completionRate >= 80) return "Almost perfect day! 🌟";
    if (completionRate >= 60) return "Great progress today! 🚀";
    if (longestStreak >= 30) return `${longestStreak} days strong! 🔥`;
    if (longestStreak >= 7) return "Building momentum! 💪";
    return "Every step counts! 🌱";
  };

  return (
    <div className="w-[400px] mx-auto bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 rounded-2xl border-2 border-primary/20 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🌱</div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Habitual Progress
        </h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-6 justify-center">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {user?.user_metadata?.name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-semibold">{user?.user_metadata?.name || 'Habit Builder'}</p>
          <p className="text-sm text-muted-foreground">Building better habits</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-primary">{totalStreaks}</div>
          <div className="text-sm text-muted-foreground">Total Streak Days</div>
        </div>
        <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-secondary">{longestStreak}</div>
          <div className="text-sm text-muted-foreground">Longest Streak</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Today's Progress</span>
          <span className="text-sm font-bold">{Math.round(completionRate)}%</span>
        </div>
        <Progress value={completionRate} className="h-3 bg-muted" />
        <p className="text-xs text-muted-foreground mt-1">
          {completedToday} of {habits.length} habits completed
        </p>
      </div>

      {/* Motivational Message */}
      <div className="text-center p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg mb-6">
        <p className="font-semibold text-primary">{generateMotivationalMessage()}</p>
      </div>

      {/* Top Habits */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Top Habits</h4>
        {habits
          .sort((a, b) => b.currentStreak - a.currentStreak)
          .slice(0, 3)
          .map((habit, index) => (
            <div key={habit.id} className="flex items-center gap-2 p-2 bg-card/30 rounded-lg">
              <span className="text-lg">{habit.emoji}</span>
              <span className="text-sm flex-1">{habit.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">{habit.currentStreak}</span>
                <span className="text-xs">🔥</span>
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-xs text-muted-foreground">
        Built with Habitual 🌱 Track your habits, build your life
      </div>
    </div>
  );
};

const CommunityLeaderboard = () => {
  // Mock data for demonstration
  const leaderboardData = [
    { name: 'Alex Chen', avatar: '', streak: 45, badges: ['🏆', '🔥', '💪'], progress: 95 },
    { name: 'Sarah Johnson', avatar: '', streak: 38, badges: ['🌟', '🔥', '💎'], progress: 92 },
    { name: 'Mike Rodriguez', avatar: '', streak: 34, badges: ['🚀', '🔥'], progress: 88 },
    { name: 'Emily Davis', avatar: '', streak: 29, badges: ['⭐', '💫'], progress: 85 },
    { name: 'David Kim', avatar: '', streak: 25, badges: ['🌱', '📈'], progress: 82 },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏆</div>
        <h2>Community Leaderboard</h2>
        <p className="text-muted-foreground">See how you stack up against other habit builders</p>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-200 ${
              index === 0 ? 'ring-2 ring-yellow-400/50 bg-yellow-50/50' :
              index === 1 ? 'ring-1 ring-gray-400/50 bg-gray-50/50' :
              index === 2 ? 'ring-1 ring-amber-600/50 bg-amber-50/50' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8">
                    {index === 0 ? <Crown className="h-6 w-6 text-yellow-500" /> :
                     index === 1 ? <Medal className="h-6 w-6 text-gray-500" /> :
                     index === 2 ? <Award className="h-6 w-6 text-amber-600" /> :
                     <span className="font-bold text-muted-foreground">#{index + 1}</span>
                    }
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{user.name}</p>
                      <div className="flex gap-1">
                        {user.badges.map((badge, i) => (
                          <span key={i} className="text-sm">{badge}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{user.streak}</span>
                        <span className="text-sm">🔥</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={user.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">{user.progress}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Join Community CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-dashed">
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-2">Join the Community</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with friends and get motivated by their progress!
          </p>
          <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
            <Users className="h-4 w-4 mr-2" />
            Connect Friends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export function SocialSharing({ habits, analytics, user }: SocialSharingProps) {
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleDownloadCard = async () => {
    setIsGeneratingCard(true);
    try {
      // In a real app, we'd use html2canvas or similar to generate an image
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a temporary link to download a mock image
      const link = document.createElement('a');
      link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      link.download = 'habitual-progress-card.png';
      link.click();
    } catch (error) {
      console.error('Error generating share card:', error);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleShare = (platform: string) => {
    const shareText = `Building better habits with Habitual! 🌱 Currently on a ${Math.max(...habits.map(h => h.currentStreak), 0)} day streak! #Habits #SelfImprovement #Habitual`;
    const shareUrl = window.location.origin;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct web sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, '_blank');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Share Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Show off your habit-building journey and inspire others!
          </p>

          {/* Share Card Preview */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div ref={shareCardRef}>
              <ShareCard user={user} habits={habits} analytics={analytics} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDownloadCard}
              disabled={isGeneratingCard}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingCard ? 'Generating Card...' : 'Download Share Card'}
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('instagram')}
                className="flex items-center gap-2"
              >
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-500" />
                Twitter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CommunityLeaderboard />
        </CardContent>
      </Card>
    </div>
  );
}