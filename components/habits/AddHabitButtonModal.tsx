"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import AddHabitForm from "@/components/habits/AddHabitForm";

export default function AddHabitButtonModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="primary"
        className="flex items-center gap-2 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 py-2 shadow-sm transition-all"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500, fontSize: '1rem' }}
        onClick={() => setOpen(true)}
        aria-label="Add Habit"
      >
        <Plus className="w-5 h-5" /> Add Habit
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-0 w-full max-w-lg relative flex flex-col items-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ cursor: "pointer" }}
            >
              ×
            </button>
            {/* Illustration/icon at the top */}
            <div className="w-full flex justify-center pt-8 pb-2">
              <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <circle cx="32" cy="32" r="32" fill="#E0F2FE" />
                <path d="M32 44c6-8 12-12 12-20a12 12 0 10-24 0c0 8 6 12 12 20z" fill="#38BDF8" />
                <ellipse cx="32" cy="44" rx="6" ry="2" fill="#0284C7" opacity="0.3" />
              </svg>
            </div>
            <div className="w-full px-8 pb-10 pt-2 flex flex-col items-center">
              <AddHabitForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 