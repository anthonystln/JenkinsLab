// src/components/Sidebar.jsx
import { Home, Users, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
	const { user } = useAuth();

	const linkClass = ({ isActive }) =>
		`flex items-center gap-2 px-4 py-2 rounded-md transition ${
		isActive ? "bg-white text-blue-600 font-semibold" : "text-white hover:bg-blue-500"
		}`;

	return (
		<aside className="w-64 bg-blue-700 text-white flex flex-col p-6">
			<NavLink to="/" className={linkClass}>
				<Home size={18} /> Dashboard
			</NavLink>

			{user?.role === "ADMIN" && (
				<NavLink to="/users" className={linkClass}>
				<Users size={18} /> Utilisateurs
				</NavLink>
			)}

			<NavLink to="/settings" className={linkClass}>
				<Settings size={18} /> Paramètres
			</NavLink>
		</aside>
	);
}
