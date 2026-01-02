import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const result = await handleLogin(formData.email, formData.password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
        // Navigate to forgot password page when implemented
        // navigate('/forgot-password');
    };

    return (
        <div className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Decorative diagonal lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-full bg-gradient-to-b from-blue-400/20 via-indigo-400/10 to-transparent transform rotate-12"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-full bg-gradient-to-t from-indigo-400/20 via-blue-400/10 to-transparent transform -rotate-12"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Main Card */}
                <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 text-center">
                        <div className="relative mb-4">
                            <img src={'/PMDLogo.png'} alt="PMD Logo" className='w-max h-14 mx-auto' />
                        </div>

                        <h1 className="text-2xl font-articulatcf-demibold text-gray-800 mb-1">Welcome Back</h1>
                        <p className="text-gray-600 font-articulat-cf text-sm">Sign in to your account</p>

                        {/* Accent line */}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-3"></div>  
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mx-6 mb-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-red-700 font-articulat-cf">{error}</span>
                            </div>
                        </div>
                    )}

                    <div className='flex flex-col w-full my-6 px-6 justify-start items-start'>
                        <p><strong><i>Temp Email:</i></strong> admin@npmjs.com</p>
                        <p><strong><i>Temp Pass:</i></strong> admin@786</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 pb-4 space-y-8">
                        {/* Email Field */}
                        <div className="space-y-3">
                            <label className="flex items-start text-md font-articulat-cf font-semibold text-gray-700">
                                <Mail className="w-5 h-5 mr-1.5 text-blue-500" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-articulat-cf text-gray-800 placeholder:text-gray-400 text-sm"
                                required
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3">
                            <label className="flex items-start text-md font-articulat-cf font-medium text-gray-700">
                                <Lock className="w-5 h-5 mr-1.5 text-blue-500" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-articulat-cf text-gray-800 placeholder:text-gray-400 pr-10 text-sm"
                                    required
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading}
                                    className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                                />
                                <span className="ml-2 text-xs text-gray-600 font-articulat-cf">Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs text-blue-600 hover:text-blue-700 font-articulat-cf font-medium transition-colors"
                                disabled={isLoading}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mx-auto w-max bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-articulatcf-demibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <User className="w-4 h-4 mr-2" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;