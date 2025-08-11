import React, { useRef, useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HabitGroupSectionProps {
  title: string;
  habits: Habit[];
}

export default function HabitGroupSection({ title, habits }: HabitGroupSectionProps) {
  // Move hooks to top level
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  // Removed hover states - only click navigation

  // Sort habits: uncompleted first (left), then completed, both alphabetically
  const sortedHabits = [...habits].sort((a, b) => {
    // First, sort by completion status (uncompleted first)
    const aCompleted = a.streak > 0; // Completed today if streak > 0
    const bCompleted = b.streak > 0;
    
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1; // Uncompleted first
    }
    
    // Then sort alphabetically within each group
    return a.name.localeCompare(b.name);
  });
  // Determine scroll threshold based on group
  let scrollThreshold = 5; // Increased to show 4 cards in normal view
  if (title.toLowerCase() === "weekly") scrollThreshold = 4;
  if (title.toLowerCase() === "monthly") scrollThreshold = 3;
  const useScroll = sortedHabits.length > scrollThreshold;
  // Responsive grid columns
  let gridCols = "grid-cols-1";
  if (sortedHabits.length === 2) gridCols = "grid-cols-1 sm:grid-cols-2";
  else if (sortedHabits.length === 3) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  else if (sortedHabits.length >= 4) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

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

  // Removed hover auto-scroll - only click navigation

  const handleScrollClick = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    
    const scrollAmount = el.clientWidth * 0.7; // Scroll 70% of container width for better UX
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!habits.length) return null;

  return (
    <section className="mb-14">
             <div className="flex items-center justify-between mb-6 mt-2">
         <div className="flex items-center gap-3">
           <h2 className="text-2xl font-bold text-left" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>{title}</h2>
           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
             <span className="flex items-center gap-1">
               <div className="w-2 h-2 bg-red-400 rounded-full"></div>
               <span>{sortedHabits.filter(h => h.streak === 0).length} to complete</span>
             </span>
             <span className="flex items-center gap-1">
               <div className="w-2 h-2 bg-green-400 rounded-full"></div>
               <span>{sortedHabits.filter(h => h.streak > 0).length} completed</span>
             </span>
           </div>
         </div>
                   {useScroll && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>Click arrows or use arrow keys to scroll</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">←</kbd>
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">→</kbd>
              </div>
            </div>
          )}
       </div>
      {useScroll ? (
        <div className="relative">
          {/* Interactive scroll arrows */}
          {showLeft && (
                                      <div 
               className="absolute left-0 top-0 h-full w-14 flex items-center z-20 transition-all duration-300 cursor-pointer group bg-gradient-to-r from-white/90 via-white/50 to-transparent dark:from-gray-800/90 dark:via-gray-800/50 dark:to-transparent"
               style={{ 
                 boxShadow: "2px 0 8px 0 rgba(0,0,0,0.07)",
                 opacity: showLeft ? 1 : 0 
               }}
               onClick={() => handleScrollClick('left')}
               role="button"
               tabIndex={0}
               aria-label="Scroll left"
               onKeyDown={(e) => {
                 if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault();
                   handleScrollClick('left');
                 }
               }}
             >
                             <ChevronLeft className="mx-auto text-gray-500 dark:text-gray-400 w-7 h-7 drop-shadow group-hover:text-blue-500 group-hover:scale-110 transition-all duration-150 group-active:scale-95" />
            </div>
          )}
          {showRight && (
                         <div 
               className="absolute right-0 top-0 h-full w-14 flex items-center z-20 transition-all duration-300 cursor-pointer group bg-gradient-to-l from-white/90 via-white/50 to-transparent dark:from-gray-800/90 dark:via-gray-800/50 dark:to-transparent"
               style={{ 
                 boxShadow: "-2px 0 8px 0 rgba(0,0,0,0.07)",
                 opacity: showRight ? 1 : 0 
               }}
               onClick={() => handleScrollClick('right')}
               role="button"
               tabIndex={0}
               aria-label="Scroll right"
               onKeyDown={(e) => {
                 if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault();
                   handleScrollClick('right');
                 }
               }}
             >
                             <ChevronRight className="mx-auto text-gray-500 dark:text-gray-400 w-7 h-7 drop-shadow group-hover:text-blue-500 group-hover:scale-110 transition-all duration-150 group-active:scale-95" />
            </div>
          )}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-2 hide-scrollbar focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg transition-all duration-200"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            role="region"
            aria-label={`${title} habits scrollable container`}
            onWheel={(e) => {
              // Enable horizontal scrolling with mouse wheel + Shift
              if (e.shiftKey) {
                e.preventDefault();
                const el = scrollRef.current;
                if (el) {
                  el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
                }
              }
            }}
            tabIndex={0}
                         onKeyDown={(e) => {
               const el = scrollRef.current;
               if (!el) return;
               
               switch (e.key) {
                 case 'ArrowLeft':
                   e.preventDefault();
                   el.scrollBy({ left: -250, behavior: 'smooth' });
                   break;
                 case 'ArrowRight':
                   e.preventDefault();
                   el.scrollBy({ left: 250, behavior: 'smooth' });
                   break;
                 case 'Home':
                   e.preventDefault();
                   el.scrollTo({ left: 0, behavior: 'smooth' });
                   break;
                 case 'End':
                   e.preventDefault();
                   el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
                   break;
               }
             }}
          >
                         {sortedHabits.map((habit) => (
               <div className="min-w-[240px] max-w-[280px] flex-shrink-0" key={habit.id}>
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