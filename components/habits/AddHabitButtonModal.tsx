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
        className="flex items-center gap-2 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 py-2 shadow-sm transition-all" // more rounded, softer, lighter
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500, fontSize: '1rem' }}
        onClick={() => setOpen(true)}
        aria-label="Add Habit"
      >
        <Plus className="w-5 h-5" /> Add Habit
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ cursor: "pointer" }}
            >
              ×
            </button>
            <AddHabitForm />
          </div>
        </div>
      )}
    </>
  );
} 