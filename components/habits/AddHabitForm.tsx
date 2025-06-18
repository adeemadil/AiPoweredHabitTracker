"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { z } from "zod";

const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  emoji: z.string().optional(),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
});

export default function AddHabitForm() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [error, setError] = useState("");

  const utils = trpc.useUtils();
  const { mutate: createHabit, isLoading } = trpc.habitTracker.create.useMutation({
    onSuccess: () => {
      setName("");
      setEmoji("");
      setFrequency("daily");
      utils.habitTracker.list.invalidate();
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const validatedData = habitSchema.parse({ name, emoji, frequency });
      createHabit(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Habit Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="e.g., Morning Meditation"
        />
      </div>

      <div>
        <label htmlFor="emoji" className="block text-sm font-medium mb-1">
          Emoji (optional)
        </label>
        <input
          type="text"
          id="emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="input"
          placeholder="e.g., 🧘‍♂️"
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium mb-1">
          Frequency
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
          className="input"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? "Adding..." : "Add Habit"}
      </button>
    </form>
  );
} 