import { createContext, useContext, useState, useEffect } from 'react';
import { axiosAuthClient } from '../config/axiosClient';
import { encryptPassword } from '../config/encryption';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                // Verify token is still valid by fetching current user
                try {
                    const response = await axiosAuthClient.get('/me');
                    const userData = response.data.user;

                    setUser(userData);
                    setIsAuthenticated(true);

                    // Update stored user data
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error) {
                    // Token is invalid or expired
                    console.error('Token verification failed:', error);
                    handleLogout();
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth state check failed:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await axiosAuthClient.post('/login', {
                email,
                password: encryptPassword(password)
            });

            const { token, user: userData } = response.data;

            // Store token and user data
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);

            let errorMessage = 'Failed to sign in. Please try again.';

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }

            return { success: false, error: errorMessage };
        }
    };

    const handleLogout = async () => {
        try {
            // Optional: Call logout endpoint
            await axiosAuthClient.post('/logout').catch(() => {
                // Ignore errors on logout
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and state
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const refreshUserData = async () => {
        if (isAuthenticated) {
            await checkAuthState();
        }
    };

    const getEmail = () => {
        if (!user) return null;
        return user.email || null;
    };

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    const value = {
        isAuthenticated,
        isLoading,

        // User data
        user,
        getEmail,
        getToken,

        // Actions
        handleLogin,
        handleLogout,
        refreshUserData,
        checkAuthState
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};