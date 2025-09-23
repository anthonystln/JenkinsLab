// src/components/Sidebar.jsx
import { Home, Users, Settings } from "lucide-react";

export default function Sidebar() {
  return (
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
  );
}
