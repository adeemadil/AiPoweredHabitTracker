"use client";
import { Habit } from "@/types/habit";
import HabitIcon from "./HabitIcon";
import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

function getCardColor(frequency?: string) {
  switch ((frequency || "daily").toLowerCase()) {
    case "daily":
      return "bg-[#e0f2fe] dark:bg-[#1e293b]";
    case "weekly":
      return "bg-[#fef9c3] dark:bg-[#78350f]";
    case "monthly":
      return "bg-[#f3e8ff] dark:bg-[#4c1d95]";
    default:
      return "bg-[#e0f2fe] dark:bg-[#1e293b]";
  }
}

function getFrequencyLabel(frequency?: string) {
  switch ((frequency || "daily").toLowerCase()) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    default:
      return "Daily";
  }
}

function getHabitNameColor(frequency?: string) {
  switch ((frequency || "daily").toLowerCase()) {
    case "daily":
      return "text-primary-700 dark:text-primary-200";
    case "weekly":
      return "text-yellow-900 dark:text-yellow-100";
    case "monthly":
      return "text-purple-800 dark:text-purple-100";
    default:
      return "text-primary-700 dark:text-primary-200";
  }
}

export default function HabitCard({ habit }: { habit: Habit }) {
  const pastel = getCardColor(habit.frequency);
  const isComplete = habit.streak > 0;
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();
  const completeHabit = trpc.habitTracker.complete.useMutation({
    onSuccess: () => utils.habitTracker.list.invalidate(),
    onSettled: () => setLoading(false),
  });

  const handleComplete = () => {
    setLoading(true);
    completeHabit.mutate({ habitId: habit.id });
  };

  return (
    <div
      className={`flex flex-col rounded-3xl shadow-lg ${pastel} overflow-hidden h-full min-h-[320px] transition-none select-none group`}
      style={{ minWidth: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      tabIndex={-1}
      aria-label={habit.name}
    >
      {/* Emoji or SVG illustration */}
      <div className="w-full h-40 flex items-center justify-center bg-white/0 overflow-hidden text-6xl select-none">
        {habit.emoji ? (
          <span role="img" aria-label="Habit emoji" className="text-7xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{habit.emoji}</span>
        ) : (
          <HabitIcon type={habit.name} size={120} />
        )}
      </div>
      {/* Streak badge */}
      <div className="flex justify-center mt-2 mb-1">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary-600 dark:text-primary-200 text-sm font-semibold shadow border border-primary-100 dark:border-gray-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
          <span role="img" aria-label="streak">🔥</span> {habit.streak || 0}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-end items-center px-4 pb-6 pt-2">
        <div className={`font-bold text-xl md:text-2xl text-center mb-1 truncate ${getHabitNameColor(habit.frequency)}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
          {habit.name}
        </div>
        <div className={`text-base font-medium text-center ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-400'}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {isComplete ? 'Complete' : 'Incomplete'}
        </div>
        {/* Mark Complete button for incomplete habits */}
        {!isComplete && (
          <Button
            variant="primary"
            onClick={handleComplete}
            disabled={loading}
            className="mt-4 w-full rounded-full py-2 text-base font-bold shadow-md"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {loading ? <Spinner className="w-5 h-5" /> : 'Mark Complete'}
          </Button>
        )}
      </div>
    </div>
  );
}
