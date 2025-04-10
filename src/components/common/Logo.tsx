import React from 'react';

const Logo: React.FC = () => {
    return (
        <svg
            className="h-8 w-8 text-primary  mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.24 16.83L11 13.69V7H12.5V12.87L17 15.5L16.24 16.83Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default Logo;
