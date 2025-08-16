"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/init";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { 
  Trophy, 
  Plus, 
  Users, 
  Calendar, 
  Target, 
  Sparkles, 
  TrendingUp,
  Clock,
  Star,
  Award,
  Brain,
  Zap
} from "lucide-react";
import toast from "react-hot-toast";

interface ChallengeSuggestion {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  duration: number;
  aiPrompt: string;
}

export default function ChallengesPage() {
  const [mounted, setMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    type: 'STREAK_BASED' as const,
    difficulty: 'EASY' as const,
    duration: 7,
    isPublic: true,
    maxParticipants: 10
  });
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ChallengeSuggestion | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'participating' | 'created'>('available');
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  
  const utils = trpc.useUtils();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Queries
  const { data: availableChallenges, isLoading: loadingAvailable } = trpc.challenges.list.useQuery();
  const { data: participatingChallenges, isLoading: loadingParticipating } = trpc.challenges.myParticipating.useQuery();
  const { data: createdChallenges, isLoading: loadingCreated } = trpc.challenges.myCreated.useQuery();
  const { data: aiSuggestions, isLoading: loadingSuggestions, refetch: refetchSuggestions } = trpc.challenges.getAISuggestions.useQuery(
    { count: 3 },
    { 
      enabled: false, // Don't fetch automatically
      retry: false, // Don't retry on failure
      refetchOnWindowFocus: false // Don't refetch when window gains focus
    }
  );

  // Mutations
  const joinChallenge = trpc.challenges.join.useMutation({
    onSuccess: () => {
      toast.success("Successfully joined the challenge!");
      utils.challenges.list.invalidate();
      utils.challenges.myParticipating.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const leaveChallenge = trpc.challenges.leave.useMutation({
    onSuccess: () => {
      toast.success("Left the challenge successfully");
      utils.challenges.myParticipating.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createFromSuggestion = trpc.challenges.createFromSuggestion.useMutation({
    onSuccess: () => {
      toast.success("Challenge created successfully!");
      setShowAISuggestions(false);
      setSelectedSuggestion(null);
      utils.challenges.myCreated.invalidate();
      utils.challenges.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createChallenge = trpc.challenges.create.useMutation({
    onSuccess: () => {
      toast.success("Challenge created successfully!");
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        description: '',
        type: 'STREAK_BASED',
        difficulty: 'EASY',
        duration: 7,
        isPublic: true,
        maxParticipants: 10
      });
      utils.challenges.myCreated.invalidate();
      utils.challenges.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleJoinChallenge = (challengeId: string) => {
    joinChallenge.mutate({ challengeId });
  };

  const handleLeaveChallenge = (challengeId: string) => {
    leaveChallenge.mutate({ challengeId });
  };

  const handleCreateFromSuggestion = (suggestion: ChallengeSuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowAISuggestions(true);
  };

  const handleConfirmCreateFromSuggestion = () => {
    if (!selectedSuggestion) return;
    
    createFromSuggestion.mutate({
      title: selectedSuggestion.title,
      description: selectedSuggestion.description,
      type: selectedSuggestion.type as any,
      difficulty: selectedSuggestion.difficulty as any,
      duration: selectedSuggestion.duration,
      isPublic: true,
      aiPrompt: selectedSuggestion.aiPrompt,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'HARD': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'EXPERT': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'STREAK_BASED': return <TrendingUp className="w-4 h-4" />;
      case 'FREQUENCY_BASED': return <Target className="w-4 h-4" />;
      case 'TIME_BASED': return <Clock className="w-4 h-4" />;
      case 'SOCIAL_BASED': return <Users className="w-4 h-4" />;
      case 'MIXED': return <Star className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const renderChallengeCard = (challenge: any, isParticipating = false, showActions = true) => (
    <Card key={challenge.id} className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            {getTypeIcon(challenge.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{challenge.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by {challenge.creator.email}
            </p>
          </div>
        </div>
        {challenge.aiGenerated && (
          <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
            <Brain className="w-3 h-3" />
            AI
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{challenge.duration} days</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-500" />
          <span>{challenge._count.participants} participants</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {isParticipating ? (
            <Button
              variant="secondary"
              onClick={() => handleLeaveChallenge(challenge.id)}
              disabled={leaveChallenge.status === "loading"}
              className="flex-1"
            >
              {leaveChallenge.status === "loading" ? <Spinner className="w-4 h-4" /> : "Leave Challenge"}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => handleJoinChallenge(challenge.id)}
              disabled={joinChallenge.status === "loading"}
              className="flex-1"
            >
              {joinChallenge.status === "loading" ? <Spinner className="w-4 h-4" /> : "Join Challenge"}
            </Button>
          )}
        </div>
      )}
    </Card>
  );

  const renderAISuggestions = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {aiSuggestions?.map((suggestion, index) => (
        <Card key={index} className="p-6 border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AI Suggestion</span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{suggestion.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{suggestion.description}</p>
          
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{suggestion.duration} days</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(suggestion.difficulty)}`}>
              {suggestion.difficulty}
            </span>
          </div>

          <Button
            variant="primary"
            onClick={() => handleCreateFromSuggestion(suggestion)}
            className="w-full"
          >
            <Zap className="w-4 h-4 mr-2" />
            Create Challenge
          </Button>
        </Card>
      ))}
    </div>
  );

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-8">
          <Spinner className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join exciting challenges and compete with friends to build better habits
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                setIsFetchingSuggestions(true);
                console.log('Fetching AI suggestions...');
                await refetchSuggestions();
                console.log('AI suggestions fetched:', aiSuggestions);
                setShowAISuggestions(!showAISuggestions);
              } catch (error) {
                console.error('Error fetching AI suggestions:', error);
                toast.error('Failed to fetch AI suggestions. Please try again.');
              } finally {
                setIsFetchingSuggestions(false);
              }
            }}
            disabled={isFetchingSuggestions}
          >
            {isFetchingSuggestions ? <Spinner className="w-4 h-4 mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
            AI Suggestions
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Challenge
          </Button>
        </div>
      </div>

      {/* AI Suggestions Section */}
      {showAISuggestions && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI-Powered Challenge Suggestions
          </h2>
          {isFetchingSuggestions ? (
            <div className="flex justify-center py-8">
              <Spinner className="w-8 h-8" />
            </div>
          ) : (
            renderAISuggestions()
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {[
          { key: 'available', label: 'Available', count: availableChallenges?.length || 0 },
          { key: 'participating', label: 'Participating', count: participatingChallenges?.length || 0 },
          { key: 'created', label: 'Created', count: createdChallenges?.length || 0 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'available' && (
          <div>
            {loadingAvailable ? (
              <div className="flex justify-center py-8">
                <Spinner className="w-8 h-8" />
              </div>
            ) : availableChallenges && availableChallenges.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableChallenges.map((challenge) => renderChallengeCard(challenge))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No challenges available</h3>
                <p>Be the first to create a challenge or check back later!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'participating' && (
          <div>
            {loadingParticipating ? (
              <div className="flex justify-center py-8">
                <Spinner className="w-8 h-8" />
              </div>
            ) : participatingChallenges && participatingChallenges.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {participatingChallenges.map((participation) => 
                  renderChallengeCard(participation.challenge, true)
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Not participating in any challenges</h3>
                <p>Join a challenge to start competing and building better habits!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'created' && (
          <div>
            {loadingCreated ? (
              <div className="flex justify-center py-8">
                <Spinner className="w-8 h-8" />
              </div>
            ) : createdChallenges && createdChallenges.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {createdChallenges.map((challenge) => 
                  renderChallengeCard(challenge, false, false)
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No challenges created yet</h3>
                <p>Create your first challenge to inspire others!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Suggestion Confirmation Modal */}
      <Modal
         open={showAISuggestions && !!selectedSuggestion}
         onClose={() => {
           setShowAISuggestions(false);
           setSelectedSuggestion(null);
         }}
               >
          {selectedSuggestion && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Create AI-Generated Challenge</h2>
              <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                {selectedSuggestion.title}
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                {selectedSuggestion.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(selectedSuggestion.difficulty)}`}>
                {selectedSuggestion.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedSuggestion.duration} days
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAISuggestions(false);
                  setSelectedSuggestion(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmCreateFromSuggestion}
                disabled={createFromSuggestion.status === "loading"}
                className="flex-1"
              >
                {createFromSuggestion.status === "loading" ? (
                  <Spinner className="w-4 h-4 mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Create Challenge
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>

    {/* Create Challenge Modal */}
    <Modal
      open={showCreateModal}
      onClose={() => setShowCreateModal(false)}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Create New Challenge</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="Enter challenge title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Describe your challenge"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as any })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="STREAK_BASED">Streak Based</option>
                <option value="FREQUENCY_BASED">Frequency Based</option>
                <option value="TIME_BASED">Time Based</option>
                <option value="SOCIAL_BASED">Social Based</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select
                value={createForm.difficulty}
                onChange={(e) => setCreateForm({ ...createForm, difficulty: e.target.value as any })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (days)</label>
              <Input
                type="number"
                value={createForm.duration}
                onChange={(e) => setCreateForm({ ...createForm, duration: parseInt(e.target.value) || 7 })}
                min="1"
                max="365"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Participants</label>
              <Input
                type="number"
                value={createForm.maxParticipants}
                onChange={(e) => setCreateForm({ ...createForm, maxParticipants: parseInt(e.target.value) || 10 })}
                min="1"
                max="100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={createForm.isPublic}
              onChange={(e) => setCreateForm({ ...createForm, isPublic: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm">Make challenge public</label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => createChallenge.mutate(createForm)}
              disabled={createChallenge.status === "loading" || !createForm.title || !createForm.description}
              className="flex-1"
            >
              {createChallenge.status === "loading" ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Challenge
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
);
}
