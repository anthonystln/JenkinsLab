import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2, MoreHorizontal } from "lucide-react";

const UserTable = ({ users, onEdit, onDelete, sortField, sortDirection, onSort }) => {

    // Génère les initiales (ex: "John Doe" -> "JD")
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    // Génère une couleur de fond aléatoire stable basée sur le nom
    const getAvatarColor = (name) => {
        const colors = [
            "bg-red-100 text-red-600",
            "bg-orange-100 text-orange-600",
            "bg-amber-100 text-amber-600",
            "bg-green-100 text-green-600",
            "bg-emerald-100 text-emerald-600",
            "bg-teal-100 text-teal-600",
            "bg-cyan-100 text-cyan-600",
            "bg-blue-100 text-blue-600",
            "bg-indigo-100 text-indigo-600",
            "bg-violet-100 text-violet-600",
            "bg-purple-100 text-purple-600",
            "bg-fuchsia-100 text-fuchsia-600",
            "bg-pink-100 text-pink-600",
            "bg-rose-100 text-rose-600",
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const renderSortIcon = (field) => {
        if (sortField === field) {
            return sortDirection === "ASC" ? (
                <ArrowUp size={14} className="text-blue-600" />
            ) : (
                <ArrowDown size={14} className="text-blue-600" />
            );
        }
        return <ArrowUpDown size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />;
    };

    return (
        <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {["name", "email", "role", "status"].map((field) => (
                            <th
                                key={field}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none group hover:bg-gray-100 transition-colors"
                                onClick={() => onSort(field)}
                            >
                                <div className="flex items-center gap-2">
                                    {field === "name" ? "Utilisateur" : field}
                                    {renderSortIcon(field)}
                                </div>
                            </th>
                        ))}
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                        <tr
                            key={u.id}
                            className="hover:bg-gray-50 transition-colors duration-150 group"
                        >
                            {/* Name & Avatar */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(u.name)}`}>
                                        {getInitials(u.name)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                                    </div>
                                </div>
                            </td>

                            {/* Email */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{u.email}</div>
                            </td>

                            {/* Role */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === "ADMIN"
                                            ? "bg-purple-100 text-purple-800"
                                            : u.role === "MANAGER"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {u.role}
                                </span>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === "ACTIVE"
                                            ? "bg-green-100 text-green-800"
                                            : u.status === "BANNED"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {u.status}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(u)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                                        title="Modifier"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(u)}
                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
