import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import SpinningLoader from './components/Loader';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Reusable wrapper component for protected routes with layout
const ProtectedLayout = ({ component: Component }) => {
  return (
    <ProtectedRoute>
      <Layout>
        <Component />
      </Layout>
    </ProtectedRoute>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading, handleLogout } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return <SpinningLoader size={50} />;
  }

  return (
    <div className={`min-h-screen ${theme}`}>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* Redirect auth pages to dashboard */}
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />

            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedLayout component={Dashboard} />} />
            <Route path="/settings" element={<ProtectedLayout component={Settings} />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </div>
  );
};

// Main App component with providers
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;