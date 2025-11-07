import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getGroupedRoutes, routeCategories } from '../config/routes';
import ClipLoader from 'react-spinners/ClipLoader'
import ThemeToggle from './ThemeToggle';

const Sidebar = ({
    isCollapsed,
    setIsCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    onLogout
}) => {
    const location = useLocation();
    const { handleLogout, getEmail } = useAuth();
    const { isDark } = useTheme();
    const groupedRoutes = getGroupedRoutes();
    const [loggingOut, isLoggingOut] = useState(false)

    const handleLogoutClick = async () => {
        try {
            isLoggingOut(true)
            await handleLogout();
            isLoggingOut(false)
        } catch (error) {
            console.error('Logout error:', error);
            isLoggingOut(false)
        }
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const SidebarContent = ({ isMobile = false }) => (
        <div className={`flex flex-col h-full ${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800' : 'bg-white'
            } transition-all duration-300 ${isMobile ? 'shadow-2xl' : 'shadow-2xl border-r'} ${isDark && !isMobile ? 'border-gray-800' : !isMobile ? 'border-gray-100' : ''
            }`}>

            {/* Header with Logo */}
            <div className={`flex items-center ${!isMobile && isCollapsed ? 'justify-center px-4' : 'justify-between px-6'
                } py-5 ${isDark ? 'border-gray-800' : 'border-gray-100'
                } border-b transition-all duration-300`}>
                <div className={`flex items-center justify-center w-full space-x-3 overflow-hidden transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                    }`}>
                    <img
                        src={'/PMDLogo.png'}
                        alt="PMD Logo"
                        className='h-14 w-auto object-contain'
                    />
                </div>

                {!isMobile ? (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-2.5 rounded-xl transition-all duration-200 group hover:cursor-pointer ${isDark
                            ? 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                            : 'hover:bg-blue-50 text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        <div className="relative">
                            {isCollapsed ? (
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                            ) : (
                                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                            )}
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={closeMobileMenu}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${isDark
                            ? 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                            : 'hover:bg-blue-50 text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* User Profile Card */}
            <div className={`transition-all duration-300 ${!isMobile && isCollapsed ? 'px-2 py-4' : 'px-3 py-5'
                }`}>
                <div className={`relative rounded-2xl transition-all duration-300 overflow-hidden ${isDark
                    ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-800/80 border border-gray-700/50'
                    : 'bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-blue-100'
                    } ${!isMobile && isCollapsed ? 'p-2' : 'p-4'}`}>
                    {/* Subtle gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-blue-500/5 to-transparent' : 'from-blue-400/5 to-transparent'
                        } pointer-events-none`}></div>

                    <div className={`relative flex items-center ${!isMobile && isCollapsed ? 'justify-center' : 'space-x-3'
                        }`}>
                        <div className={`flex-shrink-0 relative ${!isMobile && isCollapsed ? 'w-8 h-8' : 'w-10 h-10'
                            } rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300`}>
                            <div className="absolute inset-0 rounded-xl bg-white/10"></div>
                            <span className={`relative ${!isMobile && isCollapsed ? 'text-sm' : 'text-base'}`}>
                                {getEmail()?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>

                        <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                            }`}>
                            <div className={`font-semibold truncate text-sm ${isDark ? 'text-white' : 'text-gray-800'
                                }`}>
                                {getEmail()?.split('@')[0] || 'User'}
                            </div>
                            <div className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                {getEmail() || 'user@email.com'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${!isMobile && isCollapsed ? 'px-2' : 'px-4'
                } pb-4 scrollbar-thin ${isDark ? 'scrollbar-thumb-gray-700 scrollbar-track-gray-800' : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
                }`}>
                <div className="space-y-8 py-2">
                    {Object.entries(groupedRoutes).map(([categoryKey, routes], categoryIndex) => {
                        const category = routeCategories[categoryKey];

                        return (
                            <div
                                key={categoryKey}
                                style={{ animationDelay: `${categoryIndex * 50}ms` }}
                                className="nav-item-enter"
                            >
                                {/* Category Header */}
                                {category.showHeader && (!isCollapsed || isMobile) && (
                                    <div className="mb-6 px-3">
                                        <div className="flex items-center space-x-2">
                                            <div className={`flex-1 h-px ${isDark ? 'bg-gradient-to-r from-gray-400 to-transparent' : 'bg-gradient-to-r from-blue-900 to-transparent'
                                                }`}></div>
                                            <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-blue-900'
                                                }`}>
                                                {category.name}
                                            </h3>
                                            <div className={`flex-1 h-px ${isDark ? 'bg-gradient-to-l from-gray-400 to-transparent' : 'bg-gradient-to-l from-blue-900 to-transparent'
                                                }`}></div>
                                        </div>
                                    </div>
                                )}

                                {/* Category Routes */}
                                <div className="space-y-1.5">
                                    {routes.map((route, routeIndex) => {
                                        const Icon = route.icon;
                                        const isActive = location.pathname === route.path;

                                        return (
                                            <Link
                                                key={route.id}
                                                to={route.path}
                                                onClick={isMobile ? closeMobileMenu : undefined}
                                                style={{ animationDelay: `${(categoryIndex * routes.length + routeIndex) * 30}ms` }}
                                                className={`group relative flex items-center transition-all duration-200 ${!isMobile && isCollapsed
                                                    ? 'justify-center p-3 mx-auto w-12 h-12'
                                                    : 'space-x-3 px-4 py-3.5'
                                                    } rounded-xl ${isActive
                                                        ? isDark
                                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                                                        : isDark
                                                            ? 'text-gray-400 hover:bg-gray-800/50 hover:text-blue-400'
                                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                                    } nav-item-enter`}
                                                title={!isMobile && isCollapsed ? route.name : undefined}
                                            >
                                                {/* Active indicator */}
                                                {isActive && (isMobile || !isCollapsed) && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                                                )}

                                                {/* Icon with animation */}
                                                <div className={`relative ${isActive ? 'scale-110' : 'group-hover:scale-105'
                                                    } transition-transform duration-200`}>
                                                    <Icon
                                                        strokeWidth={isActive ? 2.5 : 2}
                                                        className="w-5 h-5 flex-shrink-0"
                                                    />
                                                    {isActive && (
                                                        <div className="absolute inset-0 animate-ping opacity-20">
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Route name with smooth fade */}
                                                <span className={`font-semibold text-sm truncate transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                                                    }`}>
                                                    {route.name}
                                                </span>

                                                {/* Hover effect overlay */}
                                                {!isActive && (
                                                    <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isDark
                                                        ? 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5'
                                                        : 'bg-gradient-to-r from-blue-400/5 to-indigo-400/5'
                                                        }`}></div>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className={`${!isMobile && isCollapsed ? 'px-2' : 'px-6'
                } py-4 space-y-3 border-t ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'
                } transition-all duration-300`}>
                {/* Theme Toggle */}
                <div className={`flex items-center ${!isMobile && isCollapsed ? 'justify-center' : 'justify-between'
                    } transition-all duration-300`}>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-600'
                        } transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                        }`}>
                        Theme
                    </span>
                    <ThemeToggle size="sm" />
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogoutClick}
                    disabled={loggingOut}
                    className={`w-full flex items-center ${!isMobile && isCollapsed ? 'justify-center p-3' : 'justify-center space-x-2 px-4 py-3'
                        } rounded-xl font-semibold text-sm transition-all duration-200 group relative overflow-hidden ${isDark
                            ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-800/50 hover:border-red-700/50'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={!isMobile && isCollapsed ? "Logout" : undefined}
                >
                    {/* Animated background on hover */}
                    <div className={`absolute inset-0 ${isDark ? 'bg-red-500/10' : 'bg-red-500/5'
                        } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>

                    <LogOut className={`w-5 h-5 flex-shrink-0 relative z-10 ${loggingOut ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform duration-200'
                        }`} />

                    <span className={`relative z-10 transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                        }`}>
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </span>

                    {loggingOut && (isMobile || !isCollapsed) && (
                        <ClipLoader size={16} color={isDark ? '#f87171' : '#dc2626'} className='ml-2 relative z-10' />
                    )}
                </button>
            </div>
        </div>
    );


    return (
        <>
            {/* Desktop Sidebar - Fixed with smooth transitions */}
            <div
                className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:w-16' : 'lg:w-64'
                    }`}
            >
                <SidebarContent isMobile={false} />
            </div>

            {/* Mobile Sidebar with slide animation */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <SidebarContent isMobile={true} />
            </div>
        </>
    );
};

export default Sidebar;