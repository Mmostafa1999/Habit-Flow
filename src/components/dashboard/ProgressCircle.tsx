"use client";

import React from 'react';

interface ProgressCircleProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
    percentage,
    size = 150,
    strokeWidth = 10,
    label = 'completed'
}) => {
    // Calculate SVG parameters
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                {/* Background circle */}
                <svg width={size} height={size} className="absolute">
                    <circle
                        className="text-gray-200"
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>

                {/* Progress circle */}
                <svg width={size} height={size} className="absolute transform -rotate-90">
                    <circle
                        className="text-[#E50046]"
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>

                {/* Percentage text */}
                <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">{Math.round(percentage)}%</span>
                    <span className="text-xs text-gray-500 mt-1">{label}</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressCircle; 