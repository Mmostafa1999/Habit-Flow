import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HabitForm from "./HabitForm";
import { useHabits } from "@/lib/hooks/useHabits";
import { toast } from "react-toastify";
import { Habit } from "@/types/habit";

interface AddHabitButtonProps {
    buttonText?: string;
    className?: string;
}

export default function AddHabitButton({
    buttonText = "Add Habit",
    className = "",
}: AddHabitButtonProps) {
    const [showForm, setShowForm] = useState(false);
    const { addHabit } = useHabits();

    const handleAddHabit = async (formData: Omit<Habit, "id" | "userId" | "createdAt" | "completedDates">) => {
        try {
            await addHabit(formData);
            setShowForm(false);
        } catch (error) {
            console.error("Error adding habit:", error);
            toast.error("Failed to create habit");
        }
    };

    return (
        <div>
            <button
                onClick={() => setShowForm(true)}
                className={`flex items-center px-4 py-2 rounded-md shadow-sm 
                            bg-[#E50046] text-white hover:bg-[#d81b60]
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E50046]
                            ${className}`}
            >
                <Plus className="w-5 h-5 mr-2" />
                {buttonText}
            </button>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                        onClick={(e) => {
                            // Close the form when clicking the backdrop
                            if (e.target === e.currentTarget) {
                                setShowForm(false);
                            }
                        }}
                    >
                        <div className="w-full max-w-lg">
                            <HabitForm
                                onSubmit={handleAddHabit}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 