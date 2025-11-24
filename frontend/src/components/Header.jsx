import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { useNotification } from "../context/NotificationContext";
import { ChevronDown, LogOut, User } from "lucide-react";

export default function Header() {
	const { user, isAuthenticated, logout } = useAuth();
	const { notifications, unreadCount, markAllAsRead } = useNotification();
	const location = useLocation();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const navigation = [
		{ name: "Dashboard", href: "/" },
		{ name: "Factures", href: "/invoices" },
		{ name: "Utilisateurs", href: "/users" },
	];

	return (
		<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
			<div className="flex items-center gap-8">
				<Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
					JenkinsLab
				</Link>

				{isAuthenticated && (
					<nav className="hidden md:flex items-center gap-1">
						{navigation.map((item) => {
							// 🔒 Masquer "Utilisateurs" si pas ADMIN
							if (item.href === "/users" && user?.role !== "ADMIN") return null;

							const isActive = location.pathname === item.href;
							return (
								<Link
									key={item.name}
									to={item.href}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
										? "bg-blue-50 text-blue-700"
										: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
								>
									{item.name}
								</Link>
							);
						})}
					</nav>
				)}
			</div>

			<div className="flex items-center gap-4">
				{isAuthenticated ? (
					<>
						<NotificationBell
							unread={unreadCount}
							notifications={notifications}
							onOpen={markAllAsRead}
						/>

						<div className="relative">
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
							>
								<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
									{user?.email?.charAt(0).toUpperCase()}
								</div>
								<span className="hidden sm:block">{user?.email}</span>
								<ChevronDown size={16} className="text-gray-400" />
							</button>

							{isDropdownOpen && (
								<>
									<div
										className="fixed inset-0 z-10"
										onClick={() => setIsDropdownOpen(false)}
									></div>
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-20">
										<div className="px-4 py-2 border-b border-gray-100">
											<p className="text-xs text-gray-500">Connecté en tant que</p>
											<p className="text-sm font-medium text-gray-900 truncate">
												{user?.email}
											</p>
										</div>
										<Link
											to="/settings"
											className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
											onClick={() => setIsDropdownOpen(false)}
										>
											<User size={16} /> Mon Profil
										</Link>
										<button
											onClick={() => {
												setIsDropdownOpen(false);
												logout();
											}}
											className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
										>
											<LogOut size={16} /> Déconnexion
										</button>
									</div>
								</>
							)}
						</div>
					</>
				) : (
					<Link
						to="/login"
						className="text-sm font-medium text-blue-600 hover:text-blue-500"
					>
						Se connecter
					</Link>
				)}
			</div>
		</header>
	);
}