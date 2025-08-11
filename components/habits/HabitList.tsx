"use client";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/init";
import HabitCard from "./HabitCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Habit } from "@/types/habit";
import { Plus } from "lucide-react";
import HabitGroupSection from "./HabitGroupSection";

const HABIT_CACHE_KEY = "habitCache";
const HABIT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCachedHabits() {
  if (typeof window === "undefined") return null;
  const cache = localStorage.getItem(HABIT_CACHE_KEY);
  if (!cache) return null;
  try {
    const { data, timestamp } = JSON.parse(cache);
    if (Date.now() - timestamp < HABIT_CACHE_TTL) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedHabits(data: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    HABIT_CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() }),
  );
}

export default function HabitList() {
  const [cached, setCached] = useState<Habit[] | null>(null);
  const { data: habits, isLoading } = trpc.habitTracker.list.useQuery<Habit[]>();

  // On mount, set cached habits if available
  useEffect(() => {
    const cache = getCachedHabits();
    if (cache) setCached(cache);
  }, []);

  // When habits are fetched, update cache
  useEffect(() => {
    if (habits) setCachedHabits(habits);
  }, [habits]);

  // Use habits from tRPC if available, else from cache
  const habitsToShow = habits ?? cached ?? [];
  const loading = isLoading && !cached;

  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Group habits by frequency
  const daily = habitsToShow.filter((h) => (h.frequency || "daily") === "daily");
  const weekly = habitsToShow.filter((h) => h.frequency === "weekly");
  const monthly = habitsToShow.filter((h) => h.frequency === "monthly");

  if (!habitsToShow.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[40vh] text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-blue-500" />
        </div>
        <div className="text-lg font-medium mb-2">No habits yet.</div>
        <div className="text-base">Add your first habit to get started!</div>
      </div>
    );
  }

  return (
    <div>
      <HabitGroupSection title="Daily" habits={daily} />
      <HabitGroupSection title="Weekly" habits={weekly} />
      <HabitGroupSection title="Monthly" habits={monthly} />
    </div>
  );
}
