import { Pencil, Trash2 } from "lucide-react";

const UserTable = ({ users, onEdit, onDelete }) => {
     return (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse">
            <thead>
            <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((u) => (
                <tr
                key={u.id}
                className="hover:bg-gray-50 transition-colors duration-150"
                >
                <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.role === "ADMIN"
                        ? "bg-blue-100 text-blue-700"
                        : u.role === "MANAGER"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    >
                    {u.role}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : u.status === "BANNED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    >
                    {u.status}
                    </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                    <button
                    onClick={() => onEdit(u)}
                    title="Edit"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        <Pencil size={16} className="mr-1"/>
                    </button>
                    <button
                    onClick={() => onDelete(u)}
                    title="Delete"
                    className="text-red-600 hover:text-red-800 text-sm"
                    >
                        <Trash2 size={16} className="mr-1"/>
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default UserTable;