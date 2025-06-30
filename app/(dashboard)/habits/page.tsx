import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import HabitList from "@/components/habits/HabitList";
import AddHabitForm from "@/components/habits/AddHabitForm";
import { ListChecks } from "lucide-react";

export default async function HabitsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full">
          <ListChecks className="w-7 h-7 text-primary-600 dark:text-primary-300" />
        </span>
        <h1 className="text-3xl font-bold">My Habits</h1>
      </div>
      <div className="text-gray-500 mb-8 ml-1">
        Track your progress and build new routines
      </div>
      <div className="grid gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <AddHabitForm />
        </div>
        <HabitList />
      </div>
    </div>
  );
}
