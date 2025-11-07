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
        <div className={`min-h-screen py-14 px-8 transition-colors duration-300
            ${isDark ? "bg-[#0d0d0d] text-gray-200" : "bg-gray-100 text-gray-800"}`}>

            <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
                🚀 Dashboard Overview
            </h1>

            {loading && <div className="flex justify-center"><SpinningLoader size={50} /></div>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="grid gap-6 max-w-5xl mx-auto">
                {sections.map((section, index) => (
                    <div key={index}
                        className={`p-6 rounded-2xl shadow-xl border transition-all duration-300
                        ${isDark
                                ? "bg-[#111] border-gray-800 hover:border-gray-600"
                                : "bg-white border-gray-200 hover:border-gray-300"}`}>

                        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                            <span className="text-3xl">{section.icon}</span> {section.title}
                        </h2>

                        <ul className="space-y-2">
                            {section.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span className="opacity-90">{item}</span>
                                </li>
                            ))}
                        </ul>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
