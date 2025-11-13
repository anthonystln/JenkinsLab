import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return <div className="flex justify-center items-center h-screen bg-gray-100">
			<div className="flex justify-center items-center h-screen">Chargement...</div>
		</div>
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
}