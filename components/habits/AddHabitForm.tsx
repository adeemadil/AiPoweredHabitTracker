"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

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
        <Label htmlFor="name">Habit Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning Meditation"
          required
        />
      </div>

      <div>
        <Label htmlFor="emoji">Emoji (optional)</Label>
        <Input
          type="text"
          id="emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="e.g., 🧘‍♂️"
        />
      </div>

      <div>
        <Label htmlFor="frequency">Frequency</Label>
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

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Adding..." : "Add Habit"}
      </Button>
    </form>
  );
} 