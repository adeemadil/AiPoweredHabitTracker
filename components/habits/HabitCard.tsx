"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
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
  const [showCheersModal, setShowCheersModal] = useState(false);
  const [cheerMessage, setCheerMessage] = useState("");
  const utils = trpc.useUtils();

  // Assuming habit object includes userId of the habit owner
  // interface HabitCardProps needs to be updated if not already
  // habit: { ..., userId: string; }

  const { data: cheers, isLoading: isLoadingCheers } = trpc.habits.listCheers.useQuery(
    { habitId: habit.id },
    { enabled: !!habit.id }
  );

  const { mutate: completeHabit } = trpc.habits.complete.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate(); // Assuming this is the correct invalidation path
      utils.habits.listCheers.invalidate({ habitId: habit.id });
    },
  });

  // The habit prop needs to include userId for sendCheer to work correctly.
  // Ensure habit.userId is passed to this component.
  const { mutate: sendCheer } = trpc.habits.sendCheer.useMutation({
    onSuccess: () => {
      alert("Cheer sent!");
      utils.habits.listCheers.invalidate({ habitId: habit.id });
      setShowCheersModal(false);
      setCheerMessage("");
    },
    onError: (error) => {
      alert(`Error sending cheer: ${error.message}`);
    },
  });

  const handleComplete = async () => {
    setIsCompleting(true);
    // Ensure this path matches your tRPC router structure
    completeHabit({ habitId: habit.id });
    setIsCompleting(false);
  };

  const handleSendCheer = () => {
    // This requires habit.userId to be available.
    // Adjust if habit.userId is not part of the habit object.
    // @ts-ignore
    if (!habit.userId) {
      alert("Cannot send cheer: Habit owner ID is missing.");
      return;
    }
    // @ts-ignore
    sendCheer({ habitId: habit.id, receiverId: habit.userId, message: cheerMessage });
  };

  const isCompletedToday = habit.lastCompleted
    ? format(new Date(habit.lastCompleted), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
    : false;

  return (
    <div className="card flex flex-col items-start gap-4"> {/* Changed to flex-col and items-start */}
      <div className="flex items-center justify-between w-full"> {/* Ensure this row takes full width */}
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

      {/* Cheers Button and Modal */}
      <button
        onClick={() => setShowCheersModal(true)}
        className="btn-secondary w-full mt-2" // Added w-full and mt-2 for spacing
      >
        View/Send Cheers ({cheers?.length || 0})
      </button>

      {showCheersModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Cheers for {habit.name}</h3>
            {isLoadingCheers ? <p className="text-gray-700 dark:text-gray-300">Loading cheers...</p> : (
              cheers && cheers.length > 0 ? (
                <ul className="mb-4 max-h-60 overflow-y-auto">
                  {cheers.map(cheer => (
                    <li key={cheer.id} className="border-b border-gray-200 dark:border-gray-700 py-2">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{cheer.message || "Sent a cheer!"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">From: {cheer.sender.email}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-700 dark:text-gray-300">No cheers yet. Be the first!</p>
            )}

            <div className="mt-4">
              <textarea
                value={cheerMessage}
                onChange={(e) => setCheerMessage(e.target.value)}
                placeholder="Write a cheer message..."
                className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end gap-2"> {/* Aligned buttons to the end */}
                <button
                  onClick={handleSendCheer}
                  className="btn-primary" // Using consistent button styling
                >
                  Send Cheer
                </button>
                <button
                  onClick={() => setShowCheersModal(false)}
                  className="btn-secondary" // Using consistent button styling
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 