import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to create a client with common interceptors
function createAxiosClient(baseURL) {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor (attach token)
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor (handle 401)
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );

    return client;
}

// Export separate clients
export const axiosAuthClient = createAxiosClient(`${API_BASE_URL}/auth`);
export const axiosDashboardClient = createAxiosClient(`${API_BASE_URL}/dashboard`);
export const axiosSettingsClient = createAxiosClient(`${API_BASE_URL}/settings`);