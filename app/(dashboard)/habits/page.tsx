import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import HabitList from "@/components/habits/HabitList";
import { ListChecks } from "lucide-react";
import AddHabitButtonModal from "@/components/habits/AddHabitButtonModal";

export default async function HabitsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full">
            <ListChecks className="w-8 h-8 text-primary-600 dark:text-primary-300" />
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-700 dark:text-primary-300 drop-shadow-sm">My Habits</h1>
        </div>
        {/* Add Habit button opens modal */}
        <AddHabitButtonModal />
      </div>
      <div className="text-lg text-primary-500 dark:text-primary-200 mb-8 ml-1 font-medium animate-fade-in">
        Track your progress and build new routines. Every small step counts!
      </div>
      <HabitList />
    </div>
  );
}
