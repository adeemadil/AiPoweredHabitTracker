"use client";
import { Habit } from "@/types/habit";
import HabitIcon from "./HabitIcon";
import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Modal } from "@/components/ui/Modal";

function getCardColor(frequency?: string) {
  switch ((frequency || "daily").toLowerCase()) {
    case "daily":
      return "bg-[#e0f2fe] dark:bg-[#1e293b]";
    case "weekly":
      return "bg-[#fef9c3] dark:bg-[#78350f]";
    case "monthly":
      return "bg-[#f3e8ff] dark:bg-[#4c1d95]";
    default:
      return "bg-[#e0f2fe] dark:bg-[#1e293b]";
  }
}

function getFrequencyLabel(frequency?: string) {
  switch ((frequency || "daily").toLowerCase()) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    default:
      return "Daily";
  }
}

function getHabitNameColor(frequency?: string) {
  switch ((frequency || "daily").toLowerCase()) {
    case "daily":
      return "text-primary-700 dark:text-primary-200";
    case "weekly":
      return "text-yellow-900 dark:text-yellow-100";
    case "monthly":
      return "text-purple-800 dark:text-purple-100";
    default:
      return "text-primary-700 dark:text-primary-200";
  }
}

export default function HabitCard({ habit }: { habit: Habit }) {
  const pastel = getCardColor(habit.frequency);
  const isComplete = habit.streak > 0;
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const utils = trpc.useUtils();
  const completeHabit = trpc.habitTracker.complete.useMutation({
    onSuccess: () => utils.habitTracker.list.invalidate(),
    onSettled: () => setLoading(false),
  });
  const deleteHabit = trpc.habitTracker.delete.useMutation({
    onSuccess: () => utils.habitTracker.list.invalidate(),
  });
  const [editName, setEditName] = useState(habit.name);
  const [editEmoji, setEditEmoji] = useState(habit.emoji || "");
  const [editFrequency, setEditFrequency] = useState<"daily" | "weekly" | "monthly">(habit.frequency as "daily" | "weekly" | "monthly");
  const [editError, setEditError] = useState("");
  const updateHabit = trpc.habitTracker.update?.useMutation({
    onSuccess: () => {
      utils.habitTracker.list.invalidate();
      setShowEdit(false);
    },
    onError: (error) => setEditError(error.message),
  });
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    if (!editName.trim()) {
      setEditError("Habit name is required");
      return;
    }
    updateHabit.mutate({
      habitId: habit.id,
      name: editName.trim(),
      emoji: editEmoji,
      frequency: editFrequency,
    });
  };

  const handleComplete = () => {
    setLoading(true);
    completeHabit.mutate({ habitId: habit.id });
  };
  const handleEdit = () => setShowEdit(true); // Stub: open edit modal
  const handleDelete = () => setShowDelete(true); // Stub: open confirm modal
  const confirmDelete = () => {
    deleteHabit.mutate({ habitId: habit.id });
    setShowDelete(false);
  };

  return (
    <div
      className={`relative flex flex-col rounded-3xl shadow-lg ${pastel} overflow-hidden h-full min-h-[320px] transition-none select-none group`}
      style={{
        minWidth: 0,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}
      tabIndex={-1}
      aria-label={habit.name}
    >
      {/* Edit/Delete icon buttons (hover/focus) */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20">
        <button
          aria-label="Edit Habit"
          tabIndex={0}
          className="bg-white/90 hover:bg-blue-100 rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          onClick={handleEdit}
        >
          <Pencil className="w-5 h-5 text-blue-600" />
        </button>
        <button
          aria-label="Delete Habit"
          tabIndex={0}
          className="bg-white/90 hover:bg-red-100 rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>
      {/* Emoji or SVG illustration */}
      <div className="w-full h-40 flex items-center justify-center bg-white/0 overflow-hidden text-6xl select-none relative">
        {habit.emoji ? (
          <span role="img" aria-label="Habit emoji" className="text-7xl absolute inset-0 flex items-center justify-center z-10 animate-fade-in" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{habit.emoji}</span>
        ) : (
          <HabitIcon type={habit.name} size={120} />
        )}
      </div>
      {/* Streak badge */}
      <div className="flex justify-center mt-2 mb-1">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary-600 dark:text-primary-200 text-sm font-semibold shadow border border-primary-100 dark:border-gray-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
          <span role="img" aria-label="streak">🔥</span> {habit.streak || 0}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-end items-center px-4 pb-6 pt-2">
        <div className={`font-bold text-xl md:text-2xl text-center mb-1 truncate ${getHabitNameColor(habit.frequency)}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
          {habit.name}
        </div>
        <div className={`text-base font-medium text-center ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-400'}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {isComplete ? 'Complete' : 'Incomplete'}
        </div>
        {/* Mark Complete button for incomplete habits */}
        {!isComplete && (
          <Button
            variant="primary"
            onClick={handleComplete}
            disabled={loading}
            className="mt-4 w-full rounded-full py-2 text-base font-bold shadow-md"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {loading ? <Spinner className="w-5 h-5" /> : 'Mark Complete'}
          </Button>
        )}
      </div>
      {/* Edit Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)}>
        <form onSubmit={handleEditSubmit} className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-xl flex flex-col items-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <h2 className="text-3xl font-bold text-center mt-10 mb-8" style={{ fontWeight: 700 }}>Edit Habit</h2>
          <div className="w-full px-12 flex flex-col gap-6 mb-8">
            <label className="block text-base font-semibold mb-2">Habit Name
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full text-lg bg-blue-50 placeholder:font-semibold placeholder:text-blue-300 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-400 border-none shadow-sm mt-2"
                required
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              />
            </label>
            <label className="block text-base font-semibold mb-2">Emoji
              <input
                type="text"
                value={editEmoji}
                onChange={e => setEditEmoji(e.target.value)}
                className="w-full text-lg bg-yellow-50 placeholder:font-semibold placeholder:text-yellow-300 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-yellow-400 border-none shadow-sm mt-2"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              />
            </label>
            <label className="block text-base font-semibold mb-2">Frequency
              <select
                value={editFrequency}
                onChange={e => setEditFrequency(e.target.value as "daily" | "weekly" | "monthly")}
                className="w-full text-lg bg-purple-50 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-purple-400 border-none shadow-sm font-semibold mt-2"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
          {editError && <div className="text-red-500 text-sm mb-2">{editError}</div>}
          <div className="flex gap-6 justify-center w-full px-12 mb-10">
            <Button variant="secondary" type="button" onClick={() => setShowEdit(false)} className="w-1/2 py-3 text-lg rounded-full font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-none transition-all">Cancel</Button>
            <Button variant="primary" type="submit" disabled={updateHabit.status === 'loading'} className="w-1/2 py-3 text-lg rounded-full font-bold bg-blue-300 hover:bg-blue-400 text-black shadow-none transition-all">
              {updateHabit.status === "loading" ? <Spinner className="w-5 h-5" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
      {/* Delete Confirm Modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)}>
        <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-xl flex flex-col items-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <h2 className="text-3xl font-bold text-center mt-10 mb-6" style={{ fontWeight: 700 }}>Delete Habit</h2>
          <div className="mb-8 text-center text-lg px-12">Are you sure you want to delete the habit &lsquo;{habit.name}&rsquo;? This action cannot be undone.</div>
          <div className="flex gap-6 justify-center w-full px-12 mb-10">
            <Button variant="secondary" onClick={() => setShowDelete(false)} className="w-1/2 py-3 text-lg rounded-full font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-none transition-all">Cancel</Button>
            <Button variant="primary" onClick={confirmDelete} disabled={deleteHabit.status === 'loading'} className="w-1/2 py-3 text-lg rounded-full font-bold bg-blue-300 hover:bg-blue-400 text-black shadow-none transition-all">
              {deleteHabit.status === "loading" ? <Spinner className="w-5 h-5" /> : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
