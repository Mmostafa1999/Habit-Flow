import { Timestamp } from "firebase/firestore";

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  targetDays: number;
  completedDates: Timestamp[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  color?: string;
  icon?: string;
  isArchived?: boolean;
  isCompleted?: boolean;
}

export interface HabitStats {
  habitId: string;
  name: string;
  completedCount: number;
  totalDays: number;
  completionRate: number;
}
