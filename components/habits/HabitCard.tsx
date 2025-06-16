import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    emoji?: string | null;
    streak: number;
    lastCompleted?: Date | null;
  };
}

export default function HabitCard({ habit }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const utils = trpc.useUtils();

  const { mutate: completeHabit } = trpc.habits.complete.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
    },
  });

  const handleComplete = async () => {
    setIsCompleting(true);
    completeHabit({ habitId: habit.id });
    setIsCompleting(false);
  };

  const isCompletedToday = habit.lastCompleted
    ? format(new Date(habit.lastCompleted), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
    : false;

  return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center gap-4">
        {habit.emoji && (
          <span className="text-2xl" role="img" aria-label={habit.name}>
            {habit.emoji}
          </span>
        )}
        <div>
          <h3 className="text-lg font-semibold">{habit.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {habit.streak} day streak
          </p>
        </div>
      </div>
      <button
        onClick={handleComplete}
        disabled={isCompleting || isCompletedToday}
        className={`btn-primary ${
          isCompletedToday ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isCompletedToday ? "Completed" : "Complete"}
      </button>
    </div>
  );
} 