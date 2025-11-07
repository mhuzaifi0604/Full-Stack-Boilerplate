import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SpinningLoader from './Loader';

const ProtectedRoute = ({ children, fallback = null }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <SpinningLoader size={50} />;
    }

    if (!isAuthenticated) {
        return fallback || <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;