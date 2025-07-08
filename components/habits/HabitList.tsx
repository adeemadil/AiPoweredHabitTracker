"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import HabitCard from "./HabitCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Habit } from "@/types/habit";

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
  const { data: habits = [], isLoading } = trpc.habitTracker.list.useQuery<Habit[]>(undefined, {
    onSuccess: (data) => setCachedHabits(data),
    initialData: getCachedHabits() || undefined,
  });

  if (isLoading) {
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
  const daily = habits.filter((h) => (h.frequency || "daily") === "daily");
  const weekly = habits.filter((h) => h.frequency === "weekly");
  const monthly = habits.filter((h) => h.frequency === "monthly");

  function renderGroup(title: string, group: Habit[]) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 mt-2">{title}</h2>
        {group.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[120px] text-gray-400">
            <svg width="48" height="48" fill="none" viewBox="0 0 64 64" aria-hidden="true" className="mb-2">
              <circle cx="32" cy="32" r="32" fill="#E0F2FE" />
              <path d="M32 44c6-8 12-12 12-20a12 12 0 10-24 0c0 8 6 12 12 20z" fill="#38BDF8" />
              <ellipse cx="32" cy="44" rx="6" ry="2" fill="#0284C7" opacity="0.3" />
            </svg>
            <div className="text-base">No {title.toLowerCase()} habits yet.</div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {group.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!habits?.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[40vh] text-gray-500 dark:text-gray-400">
        <svg
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="mb-4"
        >
          <circle cx="32" cy="32" r="32" fill="#E0F2FE" />
          <path
            d="M32 44c6-8 12-12 12-20a12 12 0 10-24 0c0 8 6 12 12 20z"
            fill="#38BDF8"
          />
          <ellipse
            cx="32"
            cy="44"
            rx="6"
            ry="2"
            fill="#0284C7"
            opacity="0.3"
          />
        </svg>
        <div className="text-lg font-medium mb-2">No habits yet.</div>
        <div className="text-base">Add your first habit to get started!</div>
      </div>
    );
  }

  return (
    <div>
      {renderGroup("Daily", daily)}
      {renderGroup("Weekly", weekly)}
      {renderGroup("Monthly", monthly)}
    </div>
  );
}
