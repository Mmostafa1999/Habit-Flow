import { useState } from "react";
import { Habit } from "@/types/habit";
import { CheckCircle2, MoreVertical, Pencil, Trash2, Archive } from "lucide-react";
import { motion } from "framer-motion";

interface HabitCardProps {
    habit: Habit;
    onEdit: (habit: Habit) => void;
    onDelete: (habitId: string) => void;
    onComplete: (habitId: string) => void;
    onArchive: (habitId: string) => void;
}

export default function HabitCard({
    habit,
    onEdit,
    onDelete,
    onComplete,
    onArchive,
}: HabitCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleComplete = () => {
        onComplete(habit.id);
        setIsMenuOpen(false);
    };

    const handleEdit = () => {
        onEdit(habit);
        setIsMenuOpen(false);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this habit?")) {
            onDelete(habit.id);
        }
        setIsMenuOpen(false);
    };

    const handleArchive = () => {
        onArchive(habit.id);
        setIsMenuOpen(false);
    };

    const isCompletedToday = habit.completedDates.some(
        (date) =>
            date.toDate().toDateString() === new Date().toDateString()
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-4 relative"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                    {habit.description && (
                        <p className="text-gray-600 mt-1">{habit.description}</p>
                    )}
                    <div className="flex items-center mt-2 space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {habit.category}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {habit.frequency}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <div className="py-1">
                                <button
                                    onClick={handleComplete}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {isCompletedToday ? "Mark as Incomplete" : "Mark as Complete"}
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleArchive}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Archive className="w-4 h-4 mr-2" />
                                    {habit.isArchived ? "Unarchive" : "Archive"}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isCompletedToday && (
                <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
            )}
        </motion.div>
    );
} 