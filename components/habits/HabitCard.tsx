"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import CheersModal from "./CheersModal";
import { Spinner } from "@/components/ui/Spinner";
import { Trash } from "lucide-react";
import { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  onDelete?: (id: string) => void;
}

export default function HabitCard({ habit, onDelete }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCheersModal, setShowCheersModal] = useState(false);
  const [cheerMessage, setCheerMessage] = useState("");
  const [showSelfCheerError, setShowSelfCheerError] = useState(false);
  const utils = trpc.useUtils();
  const { user } = useUser();
  const currentUserId = user?.id;

  const { data: cheers, isLoading: isLoadingCheers } =
    trpc.habitTracker.listCheers.useQuery(
      { habitId: habit.id },
      { enabled: !!habit.id },
    );

  const { mutate: completeHabit } = trpc.habitTracker.complete.useMutation({
    onSuccess: () => {
      utils.habitTracker.list.invalidate();
      utils.habitTracker.listCheers.invalidate({ habitId: habit.id });
    },
  });

  const { mutate: sendCheer } = trpc.habitTracker.sendCheer.useMutation({
    onSuccess: () => {
      toast.success("Cheer sent!", {
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
          fontSize: "0.95rem",
          padding: "12px 20px",
        },
        icon: "👏",
      });
      utils.habitTracker.listCheers.invalidate({ habitId: habit.id });
      setShowCheersModal(false);
      setCheerMessage("");
    },
    onError: (error) => {
      toast.error(error.message || "You can only send cheers to friends.", {
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
          fontSize: "0.95rem",
          padding: "12px 20px",
        },
        icon: "🚫",
      });
    },
  });

  const handleComplete = async () => {
    setIsCompleting(true);
    completeHabit({ habitId: habit.id });
    setIsCompleting(false);
  };

  const handleSendCheer = () => {
    if (!habit.userId || habit.userId === currentUserId) {
      setShowSelfCheerError(true);
      return;
    }
    sendCheer({
      habitId: habit.id,
      receiverId: habit.userId,
      message: cheerMessage,
    });
  };

  const isCompletedToday = habit.lastCompleted
    ? format(new Date(habit.lastCompleted), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
    : false;

  // Disable send cheer if it's your own habit
  const disableSendCheer = habit.userId === currentUserId;

  return (
    <div className="card flex flex-col items-start gap-4 group relative">
      <Toaster position="top-right" />
      {/* Trash icon button, only visible on hover/focus */}
      {onDelete && (
        <button
          type="button"
          aria-label="Delete habit"
          onClick={() => onDelete(habit.id)}
          className="absolute top-3 right-3 z-20 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          tabIndex={0}
        >
          <Trash className="w-5 h-5" />
        </button>
      )}
      <div className="flex items-center justify-between w-full">
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
        <Button
          onClick={handleComplete}
          disabled={isCompleting || isCompletedToday}
          className={isCompletedToday ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isCompleting ? <Spinner className="w-4 h-4 mr-2" /> : isCompletedToday ? "Completed" : "Complete"}
        </Button>
      </div>

      {/* Cheers Button and Modal */}
      <Button
        onClick={() => setShowCheersModal(true)}
        variant="secondary"
        className="w-full mt-2"
      >
        {isLoadingCheers ? <Spinner className="w-4 h-4 mr-2" /> : <>View/Send Cheers ({cheers?.length || 0})</>}
      </Button>

      {/* CheersModal extracted as atomic component */}
      {showCheersModal && (
        <CheersModal
          habitName={habit.name}
          cheers={cheers}
          isLoading={isLoadingCheers}
          cheerMessage={cheerMessage}
          setCheerMessage={setCheerMessage}
          onSendCheer={handleSendCheer}
          onClose={() => { setShowCheersModal(false); setShowSelfCheerError(false); }}
          disableSendCheer={disableSendCheer}
        />
      )}
      {showSelfCheerError && (
        <div className="text-xs text-red-500 mt-2 animate-fade-in">You can&apos;t send cheers to yourself.</div>
      )}
    </div>
  );
}
