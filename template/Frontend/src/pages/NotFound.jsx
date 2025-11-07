import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Home, User, AlertCircle } from "lucide-react";

const NotFound = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
            <div className="max-w-2xl w-full text-center">
                {/* Animated 404 Icon */}
                <div className="mb-8 relative">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 shadow-xl mb-4`}>
                        <AlertCircle className={`w-16 h-16 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} strokeWidth={1.5} />
                    </div>
                </div>

                {/* 404 Large Text */}
                <h1 className={`text-8xl md:text-9xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    404
                </h1>

                {/* Error Message */}
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Page Not Found
                </h2>

                <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Divider */}
                <div className={`w-24 h-1 mx-auto mb-8 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}></div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto cursor-pointer ${isDark
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                    >
                        <Home className="w-5 h-5" />
                        <span>Go to Main Page</span>
                    </button>

                    <button
                        onClick={() => navigate('/profile')}
                        className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto cursor-pointer ${isDark
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                            } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                    >
                        <User className="w-5 h-5" />
                        <span>View Profile</span>
                    </button>
                </div>

                {/* Additional Help */}
                <p className={`mt-12 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Need help? Contact our support team
                </p>
            </div>
        </div>
    );
};

export default NotFound;