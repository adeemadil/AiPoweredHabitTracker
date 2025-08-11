"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import AddHabitForm from "@/components/habits/AddHabitForm";
import { Modal } from "@/components/ui/Modal";

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
      <Modal open={open} onClose={() => setOpen(false)}>
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
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="w-full px-8 pb-10 pt-2 flex flex-col items-center">
            <AddHabitForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
} 