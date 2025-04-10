import { Habit } from "@/types/habit";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

// Collection reference
const habitsCollection = collection(db, "habits");

// Create a new habit
export const createHabit = async (habit: Omit<Habit, "id">) => {
  try {
    const docRef = await addDoc(habitsCollection, {
      ...habit,
      createdAt: Timestamp.now(),
      completedDates: [],
    });
    return { id: docRef.id, ...habit };
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
};

// Get all habits for a user
export const getHabits = async (userId: string) => {
  try {
    const q = query(
      habitsCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Habit[];
  } catch (error) {
    console.error("Error getting habits:", error);
    throw error;
  }
};

// Get habits for a specific date
export const getHabitsForDate = async (userId: string, date: Date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      habitsCollection,
      where("userId", "==", userId),
      where("completedDates", "array-contains", Timestamp.fromDate(startOfDay)),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Habit[];
  } catch (error) {
    console.error("Error getting habits for date:", error);
    throw error;
  }
};

// Update a habit
export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
  try {
    const habitRef = doc(db, "habits", habitId);
    await updateDoc(habitRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating habit:", error);
    throw error;
  }
};

// Mark a habit as completed for a specific date
export const markHabitCompleted = async (habitId: string, date: Date) => {
  try {
    const habitRef = doc(db, "habits", habitId);
    const timestamp = Timestamp.fromDate(date);
    await updateDoc(habitRef, {
      completedDates: arrayUnion(timestamp),
    });
  } catch (error) {
    console.error("Error marking habit as completed:", error);
    throw error;
  }
};

// Delete a habit
export const deleteHabit = async (habitId: string) => {
  try {
    const habitRef = doc(db, "habits", habitId);
    await deleteDoc(habitRef);
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw error;
  }
};

// Get habit statistics
export const getHabitStats = async (userId: string) => {
  try {
    const habits = await getHabits(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return habits.map(habit => {
      const completedCount = habit.completedDates.filter(
        date => date.toDate() >= today,
      ).length;
      const totalDays = Math.ceil(
        (today.getTime() - habit.createdAt.toDate().getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const completionRate =
        totalDays > 0 ? (completedCount / totalDays) * 100 : 0;

      return {
        habitId: habit.id,
        name: habit.name,
        completedCount,
        totalDays,
        completionRate,
      };
    });
  } catch (error) {
    console.error("Error getting habit stats:", error);
    throw error;
  }
};
