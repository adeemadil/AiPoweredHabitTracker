"use client";
import { useEffect, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/init";
import HabitCard from "./HabitCard";

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
  const { data: habits, isLoading } = trpc.habitTracker.list.useQuery();

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

  if (!habits?.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No habits yet. Add your first habit above!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
