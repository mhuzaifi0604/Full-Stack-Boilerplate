import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children, onLogout }) => {
    const { isDark } = useTheme();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                onLogout={onLogout}
            />

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
                } ml-0`}>
                {/* Mobile Header */}
                <div className={`lg:hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border-b p-4 flex items-center justify-between transition-colors duration-200`}>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className={`text-xl font-articulatcf-demibold ${isDark ? 'text-white' : 'text-gray-800'
                        } transition-colors duration-200`}>
                        Maxiom
                    </h1>
                    <ThemeToggle size="sm" />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;