import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { axiosDashboardClient } from '../config/axiosClient';
import SpinningLoader from '../components/Loader';

const Dashboard = () => {
    const { isDark } = useTheme();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboardInfo = async () => {
        setLoading(true);
        try {
            const response = await axiosDashboardClient.get('getDashboardHealth');
            setSections(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardInfo();
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-300
            ${isDark ? "bg-[#0a0a0a]" : "bg-[#fafafa]"}`}>

            {/* Content Container */}
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <h1 className={`text-4xl sm:text-5xl font-semibold mb-3 tracking-tight
                        ${isDark ? "text-white" : "text-gray-900"}`}
                        style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                        Dashboard Overview
                    </h1>
                    <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        System architecture and configuration
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <SpinningLoader size={50} />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className={`p-4 rounded-xl border ${isDark
                        ? "bg-red-900/20 border-red-800/50 text-red-400"
                        : "bg-red-50 border-red-200 text-red-700"}`}>
                        <p className="font-medium">Error: {error}</p>
                    </div>
                )}

                {/* Dashboard Cards */}
                {!loading && !error && (
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className={`group rounded-2xl transition-all duration-300 overflow-hidden
                                    ${isDark
                                        ? "bg-[#141414] border border-gray-800/50 hover:border-gray-700/80"
                                        : "bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"}`}
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}>

                                {/* Card Header */}
                                <div className={`px-8 py-6 border-b ${isDark ? "border-gray-800/50" : "border-gray-100"}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-2xl
                                            ${isDark ? "bg-gray-800/80" : "bg-gray-100"}`}>
                                            {section.icon}
                                        </div>
                                        <h2 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                                            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                                            {section.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="px-8 py-6">
                                    <ul className="space-y-4">
                                        {section.items.map((item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3 group/item">
                                                <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 transition-all duration-200
                                                    ${isDark
                                                        ? "bg-gray-600 group-hover/item:bg-blue-500"
                                                        : "bg-gray-400 group-hover/item:bg-blue-600"}`}>
                                                </div>
                                                <span className={`text-[15px] leading-relaxed transition-colors duration-200
                                                    ${isDark
                                                        ? "text-gray-400 group-hover/item:text-gray-300"
                                                        : "text-gray-600 group-hover/item:text-gray-900"}`}
                                                    style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Minimal Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;