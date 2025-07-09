"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Spinner } from "@/components/ui/Spinner";

const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  emoji: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
});

export default function AddHabitForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [error, setError] = useState("");

  const utils = trpc.useUtils();
  const { mutate: createHabit, status } =
    trpc.habitTracker.create.useMutation({
      onSuccess: () => {
        setName("");
        setEmoji("");
        setFrequency("daily");
        if (typeof window !== "undefined") {
          localStorage.removeItem("habitCache");
        }
        utils.habitTracker.list.invalidate();
        if (onSuccess) onSuccess();
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

  const isFormValid = habitSchema.safeParse({ name, emoji, frequency }).success;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7 w-full max-w-lg mx-auto p-0" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <h2 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>Add New Habit</h2>
      <div>
        <Label htmlFor="name" className="mb-2">Habit Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
          required
          className="text-lg bg-blue-50 placeholder:font-semibold placeholder:text-blue-300 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-400 border-none shadow-sm"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        />
      </div>
      <div>
        <Label htmlFor="emoji" className="mb-2">Emoji (Optional)</Label>
        <Input
          type="text"
          id="emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="Choose emoji"
          className="text-lg bg-yellow-50 placeholder:font-semibold placeholder:text-yellow-300 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-yellow-400 border-none shadow-sm"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        />
      </div>
      <div>
        <Label htmlFor="frequency" className="mb-2">Frequency</Label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly" | "monthly")}
          className="text-lg bg-purple-50 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-purple-400 border-none shadow-sm w-full font-semibold"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      {error && (
        <p className="text-red-500 text-sm animate-fade-in text-center">{error}</p>
      )}
      <Button
        type="submit"
        disabled={!isFormValid || status === "loading"}
        className={`w-full py-4 text-lg rounded-full font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all ${!isFormValid || status === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {status === "loading" ? <Spinner className="w-6 h-6" /> : "Add Habit"}
      </Button>
    </form>
  );
}
