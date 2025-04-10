"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import Image from 'next/image';
import { UserCircle } from 'lucide-react';

interface UserProfileCardProps {
    compact?: boolean;
}

const UserProfileCard = ({ compact = false }: UserProfileCardProps) => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    // Extract first name to use in greeting
    const firstName = user.displayName?.split(' ')[0] || 'there';

    return (
        <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
            <div className="relative">
                {user.photoURL ? (
                    <Image
                        src={user?.photoURL}
                        alt="Profile"
                        width={compact ? 36 : 48}
                        height={compact ? 36 : 48}
                        className="rounded-full"
                    />
                ) : (
                    <UserCircle className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} text-gray-400`} />
                )}
            </div>

            {!compact && (
                <div>
                    <h2 className="font-semibold text-lg">
                        Hi There, <span className="text-[#E50046]">{firstName}</span>
                    </h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            )}
        </div>
    );
};

export default UserProfileCard; 