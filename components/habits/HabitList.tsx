"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import HabitCard from "./HabitCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

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
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const { data: habits, isLoading, refetch } = trpc.habitTracker.list.useQuery(undefined, {
    onSuccess: (data) => setCachedHabits(data),
    initialData: getCachedHabits() || undefined,
  });
  const deleteHabit = trpc.habitTracker.delete.useMutation({
    onSuccess: () => {
      setSelected([]);
      refetch();
    },
  });
  const deleteMany = trpc.habitTracker.deleteMany.useMutation({
    onSuccess: () => {
      setSelected([]);
      setConfirming(false);
      refetch();
    },
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

  if (!habits?.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[40vh] text-gray-500 dark:text-gray-400">
        {/* Minimal illustration: plant/seedling SVG */}
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

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this habit?")) {
      deleteHabit.mutate({ habitId: id });
    }
  };
  const handleBulkDelete = () => {
    setConfirming(true);
  };
  const confirmBulkDelete = () => {
    deleteMany.mutate({ habitIds: selected });
  };

  return (
    <div>
      {selected.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          <span>{selected.length} selected</span>
          <Button
            variant="danger"
            onClick={handleBulkDelete}
            disabled={deleteMany.status === "loading"}
          >
            {deleteMany.status === "loading" ? <Spinner className="w-4 h-4 mr-2" /> : "Bulk Delete"}
          </Button>
        </div>
      )}
      {confirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
            <div className="mb-4">Are you sure you want to delete {selected.length} habits?</div>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setConfirming(false)} variant="secondary">Cancel</Button>
              <Button onClick={confirmBulkDelete} variant="danger" disabled={deleteMany.status === "loading"}>
                {deleteMany.status === "loading" ? <Spinner className="w-4 h-4 mr-2" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <div key={habit.id} className="relative">
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selected.includes(habit.id)}
                onChange={() => handleSelect(habit.id)}
                className="w-5 h-5 accent-primary-600 rounded"
                aria-label="Select habit"
              />
            </div>
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="danger"
                onClick={() => handleDelete(habit.id)}
                disabled={deleteHabit.status === "loading"}
                className="px-2 py-1 text-xs"
                title="Delete habit"
              >
                {deleteHabit.status === "loading" ? <Spinner className="w-3 h-3" /> : "Delete"}
              </Button>
            </div>
            <HabitCard habit={habit} />
          </div>
        ))}
      </div>
    </div>
  );
}
