import { PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
	const { user, isAuthenticated, logout } = useAuth();

	return (
		<header className="h-16 bg-white shadow flex items-center justify-between px-6">
			<h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
			
			<div className="flex items-center gap-4">
				{!isAuthenticated ? (
					// 🔑 si non connecté → bouton vers /login
					<a
						href="/login"
						className="text-gray-600 hover:text-gray-900"
					>
						Se connecter
					</a>
				) : (
					// ✅ si connecté → Mon compte + Déconnexion
					<>
						<span className="text-gray-700 font-medium">
							{user?.email || "Mon compte"}
						</span>
						<button
							onClick={logout}
							className="text-gray-600 hover:text-gray-900"
						>
							Déconnexion
						</button>
					</>
				)}
			</div>
		</header>
	);
}