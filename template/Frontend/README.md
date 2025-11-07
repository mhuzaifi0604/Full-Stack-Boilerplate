# Frontend Documentation

## Overview

This is the frontend of your fullstack application built with **React 19**, **Vite**, **Tailwind CSS**, and **DaisyUI**. It provides a modern, fast development experience with hot module replacement and optimized production builds.

## 🏗️ Project Structure

```
frontend/
├── public/                  # Static assets
│   └── vite.svg             # Favicon and public files
├── src/                     # Source code
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── .env                     # Environment variables
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── eslint.config.js         # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn

### Installation

Dependencies are automatically installed during project creation. To reinstall:

```bash
npm install
```

### Environment Variables

Configure your environment variables in the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

**Note:** All environment variables in Vite must be prefixed with `VITE_` to be exposed to your application.

### Running the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` with hot module replacement (HMR) enabled.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Linting

```bash
npm run lint
```

## 📦 Tech Stack

### Core Technologies

- **React 19** - UI library with latest features
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library

### Additional Libraries

- **Axios** - HTTP client for API calls
- **JWT Decode** - Decode JWT tokens
- **Crypto-JS** - Encryption utilities
- **Lucide React** / **Heroicons** - Icon libraries
- **React Spinners** - Loading indicators
- **Recharts** - Charting library
- **XLSX** - Excel file handling

## 🧩 Component Structure

### Creating a New Component

Create components in `src/components/`:

```jsx
// src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Creating a Page

Create pages in `src/pages/`:

```jsx
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
};

export default Dashboard;
```

## 🔌 API Integration

### Setting Up API Services

Create service files in `src/services/`:

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Creating API Service Functions

```javascript
// src/services/userService.js
import api from './api';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
```

## 📡 Routing

### Setting Up Routes

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Protected Routes

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

// Usage in App.jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 🎨 Styling with Tailwind & DaisyUI

### Tailwind Utility Classes

```jsx
// Layout
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Content */}
  </div>
</div>

// Flexbox
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

// Responsive Text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
```

### DaisyUI Components

```jsx
// Buttons
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-link">Link</button>

// Cards
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content goes here</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>

// Alerts
<div className="alert alert-info">
  <span>Info alert</span>
</div>
<div className="alert alert-success">
  <span>Success alert</span>
</div>
<div className="alert alert-warning">
  <span>Warning alert</span>
</div>
<div className="alert alert-error">
  <span>Error alert</span>
</div>

// Modal
<input type="checkbox" id="my-modal" className="modal-toggle" />
<div className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Modal Title</h3>
    <p className="py-4">Modal content</p>
    <div className="modal-action">
      <label htmlFor="my-modal" className="btn">Close</label>
    </div>
  </div>
</div>
```

### Customizing Tailwind Config

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': '#your-color',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}
```

## 🔐 Authentication

### Login Example

```jsx
// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full mb-4"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full mb-4"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

## 📦 State Management

For simple state management, use React's built-in hooks:

### Context API Example

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## 📊 Charts & Visualization

### Using Recharts

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
];

const Chart = () => (
  <LineChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
);
```

## ✨ Best Practices

1. **Component Organization**: Keep components small and focused
2. **Custom Hooks**: Extract reusable logic into custom hooks
3. **Error Handling**: Always handle errors in async operations
4. **Loading States**: Show loading indicators for async operations
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Performance**: Use React.memo for expensive components
7. **Environment Variables**: Never commit sensitive data

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [DaisyUI Documentation](https://daisyui.com/)
- [React Router Documentation](https://reactrouter.com/)

## 🐛 Troubleshooting

### Module Not Found
```bash
npm install
```

### Port Already in Use
Change the port in `vite.config.js` or kill the process:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Build Errors
Clear cache and rebuild:
```bash
rm -rf node_modules dist .vite
npm install
npm run build
```
