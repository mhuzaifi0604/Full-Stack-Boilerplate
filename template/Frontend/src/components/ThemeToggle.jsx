import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ size = 'md', className = '' }) => {
    const { theme, toggleTheme } = useTheme();

    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };

    return (
        <button
            onClick={toggleTheme}
            className={`btn btn-ghost cursor-pointer ${sizeClasses[size]} ${className}`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
            <MoonIcon strokeWidth={'2'} className="w-6 h-6 text-blue-500" />
            ) : (
                <SunIcon strokeWidth={'2'} className="w-6 h-6 text-yellow-400" />
            )}
        </button>
    );
};

export default ThemeToggle;