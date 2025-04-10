"use client";

import React from 'react';
import { Check, MoreVertical } from 'lucide-react';
import AddHabitButton from "@/components/habits/AddHabitButton";

// Utility function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  categoryId?: string;
  color?: string;
  streak?: number;
}

interface HabitListProps {
  habits: Habit[];
  selectedDate?: Date;
  onToggleComplete?: (habitId: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  selectedDate = new Date(),
  onToggleComplete
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{formatDate(selectedDate)}</h2>

        <AddHabitButton
          buttonText="Create New Habit"
          className="justify-center hover:shadow-md transition-all"
        />
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No habits for this day</p>
          <p className="text-sm text-gray-500 mb-6">Click &quot;Create New Habit&quot; to start tracking your habits</p>
          <AddHabitButton
            buttonText="Create New Habit"
            className="mx-auto"
          />
        </div>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md border-l-4"
              style={{ borderLeftColor: habit.color || '#E50046' }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => isToday && onToggleComplete && onToggleComplete(habit.id)}
                  disabled={!isToday}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${habit.completed ? 'bg-[#E50046] border-[#E50046]' :
                    isToday ? 'border-gray-300 hover:border-[#E50046]' :
                      'border-gray-300 opacity-50 cursor-not-allowed'
                    }`}
                  aria-label={!isToday ? "Cannot modify past or future habits" :
                    habit.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {habit.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                <div>
                  <h3 className={`font-medium ${habit.completed ? 'line-through text-gray-500' : ''}`}>
                    {habit.name}
                  </h3>
                  {habit.streak && (
                    <span className="text-xs text-gray-500 flex items-center mt-1">
                      <span className="mr-1">🔥</span> {habit.streak} day streak
                    </span>
                  )}
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100" aria-label="More options">
                <MoreVertical className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isToday && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-700 text-sm">
            You can only mark habits as completed on the current day.
          </p>
        </div>
      )}
    </div>
  );
};

export default HabitList; 