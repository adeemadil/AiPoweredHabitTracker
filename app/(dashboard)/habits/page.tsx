import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import HabitList from "@/components/habits/HabitList";
import AddHabitButtonModal from "@/components/habits/AddHabitButtonModal";

export default async function HabitsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 pb-16 px-2 md:px-0">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-700 dark:text-primary-200" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>My Habits</h1>
        <AddHabitButtonModal />
      </div>
      <HabitList />
    </div>
  );
}
