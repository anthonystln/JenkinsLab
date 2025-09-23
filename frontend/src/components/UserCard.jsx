import { Trash2 } from "lucide-react";

export default function UserCard({ user, onEdit, onDelete }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition relative">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <span className="inline-block mt-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                ID: {user.id}
            </span>
            <button
                onClick={() => onEdit(user)}
                className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm"
            >
                Modifier
            </button>
            <button
                onClick={() => onDelete(user)}
                className="absolute bottom-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center gap-1"
            >
                <Trash2 size={14} /> Supprimer
            </button>
        </div>
    );
}