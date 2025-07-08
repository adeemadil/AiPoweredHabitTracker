import React, { useRef, useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HabitGroupSectionProps {
  title: string;
  habits: Habit[];
}

export default function HabitGroupSection({ title, habits }: HabitGroupSectionProps) {
  if (!habits.length) return null;
  // Sort habits by streak descending
  const sortedHabits = [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0));
  // Determine scroll threshold based on group
  let scrollThreshold = 4;
  if (title.toLowerCase() === "weekly") scrollThreshold = 3;
  if (title.toLowerCase() === "monthly") scrollThreshold = 2;
  const useScroll = sortedHabits.length > scrollThreshold;
  // Responsive grid columns
  let gridCols = "grid-cols-1";
  if (sortedHabits.length === 2) gridCols = "grid-cols-1 sm:grid-cols-2";
  else if (sortedHabits.length === 3) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  else if (sortedHabits.length >= 4) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function updateIndicators() {
      if (!el) return;
      setShowLeft(el.scrollLeft > 0);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
    updateIndicators();
    el.addEventListener("scroll", updateIndicators);
    window.addEventListener("resize", updateIndicators);
    return () => {
      if (el) el.removeEventListener("scroll", updateIndicators);
      window.removeEventListener("resize", updateIndicators);
    };
  }, []);

  return (
    <section className="mb-14">
      <h2 className="text-2xl font-bold mb-6 mt-2 text-left" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>{title}</h2>
      {useScroll ? (
        <div className="relative">
          {/* Scroll indicators */}
          {showLeft && (
            <div className="pointer-events-none absolute left-0 top-0 h-full w-14 flex items-center z-20 transition-opacity duration-300" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.05) 100%)", boxShadow: "2px 0 8px 0 rgba(0,0,0,0.07)", opacity: showLeft ? 1 : 0 }}>
              <ChevronLeft className="mx-auto text-gray-400 dark:text-gray-600 w-7 h-7 drop-shadow" />
            </div>
          )}
          {showRight && (
            <div className="pointer-events-none absolute right-0 top-0 h-full w-14 flex items-center z-20 transition-opacity duration-300" style={{ background: "linear-gradient(to left, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.05) 100%)", boxShadow: "-2px 0 8px 0 rgba(0,0,0,0.07)", opacity: showRight ? 1 : 0 }}>
              <ChevronRight className="mx-auto text-gray-400 dark:text-gray-600 w-7 h-7 drop-shadow" />
            </div>
          )}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-2 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sortedHabits.map((habit) => (
              <div className="min-w-[260px] max-w-xs flex-shrink-0" key={habit.id}>
                <HabitCard habit={habit} />
              </div>
            ))}
          </div>
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      ) : (
        <div className={`grid gap-8 ${gridCols}`}>
          {sortedHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </section>
  );
} 