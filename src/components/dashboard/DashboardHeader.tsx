"use client";

import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import UserProfileCard from './UserProfileCard';

interface DashboardHeaderProps {
    onSearch?: (query: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSearch }) => {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('searchQuery') as string;
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <header className="bg-white border-b py-4 px-6 hidden md:flex items-center justify-between sticky top-0 z-20">
            <div className="flex-1 hidden md:flex">
                <UserProfileCard />
            </div>

            <div className="flex-1 max-w-md">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        name="searchQuery"
                        placeholder="Search..."
                        className="w-full border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#E50046] focus:ring-1 focus:ring-[#E50046]"
                        aria-label="Search habits"
                    />
                    <button
                        type="submit"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        aria-label="Submit search"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </form>
            </div>

            <div className="flex-1 flex justify-end gap-3">
                <button
                    className="p-2 rounded-full hover:bg-gray-100 relative"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-[#E50046] rounded-full"></span>
                </button>
                <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader; 