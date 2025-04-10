"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useHabits } from "@/lib/hooks/useHabits";
import { toast } from "react-toastify";
import PageTransition from "@/components/common/PageTransition";
import LoadingScreen from "@/components/common/LoadingScreen";
import usePageLoading from "@/lib/hooks/usePageLoading";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileHeader from "@/components/dashboard/MobileHeader";
import HabitList from "@/components/dashboard/HabitList";
import ProgressCircle from "@/components/dashboard/ProgressCircle";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import CategoryFilter from "@/components/dashboard/CategoryFilter";

const SAMPLE_CATEGORIES = [
    { id: '1', name: 'work', color: '#4CAF50' },
    { id: '2', name: 'health', color: '#2196F3' },
    { id: '3', name: 'learning', color: '#FF9800' },
];

// Utility function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { initialLoading } = usePageLoading({ initialDelay: 1000 });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [completionPercentage, setCompletionPercentage] = useState(0);

    // Use the custom hook to get habits data and functions
    const {
        habits,
        loading: habitsLoading,
        error,
        completeHabit
    } = useHabits({
        category: selectedCategory || undefined,
        showArchived: false
    });

    useEffect(() => {
        // Redirect to home if not authenticated
        if (!user) {
            router.push("/");
        }
        // Redirect to verify email if not verified
        else if (!user.emailVerified) {
            router.push("/verify-email");
        }
    }, [user, router]);

    // Calculate completion percentage using data from Firebase
    useEffect(() => {
        if (habits.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if each habit has been completed for today
            const completedCount = habits.filter(habit =>
                habit.completedDates?.some(date => {
                    const completedDate = date.toDate();
                    return isSameDay(completedDate, today);
                })
            ).length;

            setCompletionPercentage(Math.round((completedCount / habits.length) * 100));
        } else {
            setCompletionPercentage(0);
        }
    }, [habits]);

    const handleToggleComplete = (habitId: string) => {
        // Only allow marking habits as completed on the current day
        const today = new Date();

        if (!isSameDay(selectedDate, today)) {
            toast.warning("Habits can only be marked as completed for the current day");
            return;
        }

        // Use the completeHabit function from useHabits
        completeHabit(habitId, today)
            .catch(error => {
                toast.error("Failed to update habit completion status");
                console.error("Error toggling habit completion:", error);
            });
    };

    const handleAddHabit = () => {
        // We don't need to implement anything here - the AddHabitButton component 
        // will handle opening the form and adding the habit directly using the useHabits hook
        console.log("Add new habit button clicked");
    };

    const handleManageCategories = () => {
        // This would open a modal or navigate to categories management page
        console.log("Manage categories");
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (!user) {
        return null; // Will redirect in useEffect
    }

    // Show loading while initializing or fetching habits
    if (initialLoading || habitsLoading) {
        return <LoadingScreen />;
    }

    // Show error message if there was an error fetching habits
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9ef]">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Habits</h2>
                    <p className="text-gray-700">{error}</p>
                    <button
                        className="mt-4 bg-[#E50046] text-white px-4 py-2 rounded-md"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Map habits from Firebase to the format expected by HabitList
    const formattedHabits = habits.map(habit => {
        // Check if habit is completed for the selected date
        const isCompletedForSelectedDate = habit.completedDates?.some(date => {
            const completedDate = date.toDate();
            return isSameDay(completedDate, selectedDate);
        }) || false;

        // Calculate streak based on consecutive completed days
        // You would implement more sophisticated streak calculation in a production app
        const streak = habit.completedDates?.length || 0;

        return {
            id: habit.id,
            name: habit.name,
            completed: isCompletedForSelectedDate,
            color: habit.color || "#E50046", // Provide default color
            categoryId: habit.category,
            streak: streak > 0 ? streak : undefined,
        };
    });

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#f8f9ef] flex flex-col">
                {/* Mobile Header - only visible on small screens */}
                <MobileHeader
                    onMenuToggle={toggleMobileMenu}
                    isMenuOpen={isMobileMenuOpen}
                />

                <div className="flex flex-1 relative">
                    {/* Mobile Menu Overlay */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                            onClick={toggleMobileMenu}
                        />
                    )}

                    {/* Sidebar - fixed on mobile when open */}
                    <div
                        className={`
              ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 w-64 z-50' : 'hidden'} 
              md:relative md:flex md:w-60 h-full
            `}
                    >
                        <Sidebar
                            isMobile={isMobileMenuOpen}
                            onClose={toggleMobileMenu}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        {/* Desktop Header */}
                        <DashboardHeader />

                        {/* Dashboard Content */}
                        <main className="flex-1 p-4 md:p-6 overflow-auto">
                            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Main Content Area - Habits List */}
                                <div className="lg:col-span-8 space-y-6">
                                    {/* Category Filters */}
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <CategoryFilter
                                            categories={SAMPLE_CATEGORIES}
                                            selectedCategory={selectedCategory}
                                            onSelectCategory={setSelectedCategory}
                                            onManageCategories={handleManageCategories}
                                        />
                                    </div>

                                    {/* Habits List */}
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <HabitList
                                            habits={formattedHabits}
                                            selectedDate={selectedDate}
                                            onToggleComplete={handleToggleComplete}
                                            onAddHabit={handleAddHabit}
                                        />
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Today's Progress */}
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <h3 className="font-semibold mb-4">Today&apos;s Progress</h3>
                                        <ProgressCircle
                                            percentage={completionPercentage}
                                            label="of habits completed"
                                        />
                                        {/* <div className="mt-4">
                                            <AddHabitButton
                                                buttonText="Create New Habit"
                                                className="w-full justify-center"
                                            />
                                        </div> */}
                                    </div>

                                    {/* Calendar */}
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <CalendarWidget onDateSelect={handleDateSelect} />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
} 