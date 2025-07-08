"use client";
import { Habit } from "@/types/habit";
import HabitIcon from "./HabitIcon";

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
  const freqLabel = getFrequencyLabel(habit.frequency);
  return (
    <div
      className={`flex flex-col items-center justify-start rounded-2xl shadow-md ${pastel} p-6 min-h-[260px] transition-none select-none group`}
      style={{ minWidth: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      tabIndex={-1}
      aria-label={habit.name}
    >
      <div className="mb-4 flex items-center justify-center w-full">
        <HabitIcon type={habit.name} />
      </div>
      {/* Hoverable streak area */}
      <div className="relative w-full flex justify-center mb-2" style={{ minHeight: 24 }}>
        <div className="absolute left-1/2 -translate-x-1/2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 text-primary-600 dark:text-primary-200 text-xs font-semibold shadow-sm border border-primary-100 dark:border-gray-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
            <span className="flex items-center gap-1"><span role="img" aria-label="streak">🔥</span> {habit.streak}</span>
            <span className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{freqLabel}</span>
          </span>
        </div>
      </div>
      <div className="w-full text-center">
        <div className={`font-bold text-lg md:text-xl ${getHabitNameColor(habit.frequency)} mb-1 truncate`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>{habit.name}</div>
        <div className="text-sm text-gray-400 dark:text-gray-400 font-medium" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Complete</div>
      </div>
    </div>
  );
}
