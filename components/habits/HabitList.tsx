"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import HabitCard from "./HabitCard";

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
    <div className="grid gap-4">
      {habits.map((habit: { id: string; name: string; emoji?: string | null; streak: number; lastCompleted?: Date | null; userId: string }) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
} 