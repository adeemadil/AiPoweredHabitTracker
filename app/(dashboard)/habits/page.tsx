import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import HabitList from "@/components/habits/HabitList";
import AddHabitForm from "@/components/habits/AddHabitForm";

export default async function HabitsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Habits</h1>
      <div className="grid gap-8">
        <AddHabitForm />
        <HabitList />
      </div>
    </div>
  );
} 