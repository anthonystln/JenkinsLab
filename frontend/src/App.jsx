import { useEffect, useState } from 'react'
import { Home, Users, Settings, PlusCircle } from "lucide-react";
import './App.css'

function App() {
	const [users, setUsers] = useState([]);
	
	useEffect(() => {
		fetch("http://springboot-app:8081/users/") // ton backend
      .then(res => res.json())
      .then(data => setUsers(data));
	}, []);

	return (
		<div className="h-screen w-screen flex flex-col bg-gray-50">
			{/* Header */}
			<header className="h-16 bg-white shadow flex items-center justify-between px-6">
				<h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
				<button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700">
				<PlusCircle size={18} /> Ajouter
				</button>
			</header>

			{/* Layout principal */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 bg-blue-700 text-white flex flex-col p-6">
				<nav className="space-y-4">
					<a href="#" className="flex items-center gap-2 hover:text-blue-300">
					<Home size={18} /> Dashboard
					</a>
					<a href="#" className="flex items-center gap-2 hover:text-blue-300">
					<Users size={18} /> Utilisateurs
					</a>
					<a href="#" className="flex items-center gap-2 hover:text-blue-300">
					<Settings size={18} /> Paramètres
					</a>
				</nav>
				</aside>

				{/* Contenu */}
				<main className="flex-1 p-8 overflow-y-auto">
					<h2 className="text-2xl font-semibold mb-6">Liste des utilisateurs</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{users.map((u) => (
						<div
							key={u.id}
							className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
						>
							<h3 className="text-lg font-semibold">{u.name}</h3>
							<p className="text-gray-500">{u.email}</p>
							<span className="inline-block mt-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
							ID: {u.id}
							</span>
						</div>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}

export default App
