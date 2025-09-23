import { PlusCircle } from "lucide-react";

export default function Header({ onAddClick }) {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700"
      >
        <PlusCircle size={18} /> Ajouter
      </button>
    </header>
  );
}