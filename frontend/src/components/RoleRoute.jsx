import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ children, roles }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Chargement...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Supporte soit user.role (string), soit user.roles (array d’objets/strings)
    if (!roles.includes(user?.role)) {
        return <Navigate to="/" replace />; // 🚫 redirige vers le dashboard
    }
    
    return children;
}