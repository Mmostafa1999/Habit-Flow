import { useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { createHabit, updateHabit } from "@/lib/firebase/habits";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { Timestamp } from "firebase/firestore";

interface HabitFormProps {
    initialData?: Partial<Habit>;
    onSubmit: (data: Omit<Habit, "id" | "userId" | "createdAt" | "completedDates">) => void;
    onCancel: () => void;
}

const CATEGORIES = [
    "Health",
    "Fitness",
    "Productivity",
    "Learning",
    "Mindfulness",
    "Social",
    "Other",
];

const FREQUENCIES = ["daily", "weekly", "monthly"] as const;
type Frequency = typeof FREQUENCIES[number];

export default function HabitForm({
    initialData,
    onSubmit,
    onCancel,
}: HabitFormProps) {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Health",
        frequency: "daily" as Frequency,
        targetDays: 1,
        color: "#E50046",
        icon: "🏃",
    });
    const [errors, setErrors] = useState<{
        name?: string;
        targetDays?: string;
    }>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                category: initialData.category || "Health",
                frequency: (initialData.frequency || "daily") as Frequency,
                targetDays: initialData.targetDays || 1,
                color: initialData.color || "#E50046",
                icon: initialData.icon || "🏃",
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors: {
            name?: string;
            targetDays?: string;
        } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Habit name is required";
        }

        const maxDays =
            formData.frequency === "daily" ? 7 :
                formData.frequency === "weekly" ? 7 : 31;

        if (formData.targetDays < 1 || formData.targetDays > maxDays) {
            newErrors.targetDays = `Target days must be between 1 and ${maxDays}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user) {
            toast.error("You must be logged in to create habits");
            return;
        }

        setIsSubmitting(true);

        try {
            if (initialData && initialData.id) {
                // Update existing habit
                await updateHabit(initialData.id, formData);
                toast.success("Habit updated successfully!");
            } else {
                // Create new habit with required userId
                // The createHabit function will add completedDates and createdAt internally
                // but we need to supply these fields for TypeScript
                const newHabit: Omit<Habit, "id"> = {
                    ...formData,
                    userId: user.uid,
                    completedDates: [],
                    createdAt: Timestamp.now()
                };
                await createHabit(newHabit);
            }
            onSubmit(formData);
        } catch (error) {
            console.error("Error saving habit:", error);
            toast.error(error instanceof FirebaseError
                ? `Error: ${error.message}`
                : "Failed to save habit");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "targetDays" ? parseInt(value, 10) || 1 : value,
        }));

        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
        >
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.name ? "border-red-500" : ""
                            }`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="frequency"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Frequency
                    </label>
                    <select
                        id="frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        {FREQUENCIES.map((frequency) => (
                            <option key={frequency} value={frequency}>
                                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="targetDays"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Target Days
                    </label>
                    <input
                        type="number"
                        id="targetDays"
                        name="targetDays"
                        value={formData.targetDays}
                        onChange={handleChange}
                        min="1"
                        max={formData.frequency === "daily" ? "7" : formData.frequency === "weekly" ? "7" : "31"}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.targetDays ? "border-red-500" : ""
                            }`}
                    />
                    {errors.targetDays && (
                        <p className="text-red-500 text-xs mt-1">{errors.targetDays}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="color"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Color
                    </label>
                    <input
                        type="color"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="icon"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Icon
                    </label>
                    <input
                        type="text"
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        maxLength={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#E50046] border border-transparent rounded-md shadow-sm hover:bg-[#E50046]-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
                >
                    {isSubmitting ?
                        "Saving..." :
                        (initialData?.id ? "Update Habit" : "Create Habit")}
                </button>
            </div>
        </motion.form>
    );
} 