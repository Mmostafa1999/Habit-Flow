import { db } from "@/lib/firebase/firebase";
import {
  createHabit,
  deleteHabit,
  getHabitStats,
  markHabitCompleted,
  updateHabit,
} from "@/lib/firebase/habits";
import { Habit } from "@/types/habit";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

interface UseHabitsOptions {
  category?: string;
  showArchived?: boolean;
}

export const useHabits = (options: UseHabitsOptions = {}) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const habitsCollection = collection(db, "habits");

    // Build the query based on options
    const queryConstraints = [
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    ];

    if (options.category) {
      queryConstraints.push(where("category", "==", options.category));
    }

    if (!options.showArchived) {
      queryConstraints.push(where("isArchived", "==", false));
    }

    const q = query(habitsCollection, ...queryConstraints);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Habit[];
        setHabits(habitsData);
        setLoading(false);
      },
      error => {
        console.error("Error fetching habits:", error);
        setError("Failed to load habits");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, options.category, options.showArchived]);

  const addHabit = async (
    habit: Omit<Habit, "id" | "userId" | "createdAt" | "completedDates">,
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await createHabit({
        ...habit,
        userId: user.uid,
        completedDates: [],
        createdAt: Timestamp.now(),
      });
      toast.success("Habit created successfully!");
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
      throw error;
    }
  };

  const editHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      await updateHabit(habitId, updates);
      toast.success("Habit updated successfully!");
    } catch (error) {
      console.error("Error updating habit:", error);
      toast.error("Failed to update habit");
      throw error;
    }
  };

  const removeHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
      toast.success("Habit deleted successfully!");
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
      throw error;
    }
  };

  const completeHabit = async (habitId: string, date: Date = new Date()) => {
    try {
      await markHabitCompleted(habitId, date);
      toast.success("Habit marked as completed!");
    } catch (error) {
      console.error("Error completing habit:", error);
      toast.error("Failed to mark habit as completed");
      throw error;
    }
  };

  const getStats = async () => {
    if (!user) throw new Error("User not authenticated");
    return getHabitStats(user.uid);
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    editHabit,
    removeHabit,
    completeHabit,
    getStats,
  };
};
