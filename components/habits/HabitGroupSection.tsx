import React from "react";
import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

interface HabitGroupSectionProps {
  title: string;
  habits: Habit[];
}

export default function HabitGroupSection({ title, habits }: HabitGroupSectionProps) {
  if (!habits.length) return null;
  // Determine grid columns based on habit count
  let gridCols = "grid-cols-1";
  if (habits.length === 2) gridCols = "grid-cols-1 sm:grid-cols-2";
  else if (habits.length === 3) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  else if (habits.length >= 4) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-bold mb-6 mt-2 text-left" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>{title}</h2>
      <div className={`grid gap-8 ${gridCols}`}>
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>
    </section>
  );
} 