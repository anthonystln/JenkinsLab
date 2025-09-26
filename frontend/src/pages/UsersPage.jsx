import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserForm from "../components/UserForm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Pagination from "../components/Pagination";
import { toast } from "react-hot-toast";
import { addUser, updateUser, deleteUser, fetchUsers } from "../services/userService";
import UserTable from "../components/UserTable";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "" });
    const [editingUser, setEditingUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [errors, setErrors] = useState({ name: "", email: "" });
    const [searchQuery, setSearchQuery] = useState("");

    // 🔽 nouveaux filtres
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // pagination
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(6);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // 🔄 fonction utilitaire : recharge avec les filtres actuels
    const reloadUsers = async () => {
        const result = await fetchUsers({
            query: searchQuery,
            role: roleFilter,
            status: statusFilter,
            page,
            size
        });
        setUsers(result.content || []);
        setTotalElements(result.totalElements || 0);
    };

    // 🔄 Charge utilisateurs (recherche + filtrage + pagination)
    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(async () => {
            try {
                await reloadUsers();
            } catch (err) {
                toast.error("Erreur lors du chargement");
                setUsers([]);
                setTotalElements(0);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, roleFilter, statusFilter, page, size]);

    // ✅ Validation formulaire
    const validateForm = () => {
        let valid = true;
        let newErrors = { name: "", email: "" };

        if (!newUser.name.trim()) {
            newErrors.name = "Le nom est requis.";
            valid = false;
        } else if (newUser.name.length < 2) {
            newErrors.name = "Le nom doit faire au moins 2 caractères.";
            valid = false;
        }

        if (!newUser.email.trim()) {
            newErrors.email = "L'email est requis.";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
            newErrors.email = "Format d'email invalide.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // ✅ Ajout / modification
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (editingUser) {
                await updateUser(editingUser.id, newUser);
                toast.success("Utilisateur mis à jour");
            } else {
                await addUser(newUser);
                toast.success("Utilisateur ajouté");
            }

            // 👉 recharge
            await reloadUsers();

            setNewUser({ name: "", email: "" });
            setErrors({ name: "", email: "" });
            setEditingUser(null);
            setShowForm(false);
        } catch (err) {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    // ✅ Suppression
    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            toast.success("Utilisateur supprimé");

            // ⚡ recharge
            await reloadUsers();
            setConfirmDelete(null);
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-50">
            <Header
                onAddClick={() => {
                    setEditingUser(null);
                    setNewUser({ name: "", email: "" });
                    setErrors({ name: "", email: "" });
                    setShowForm(true);
                }}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 p-8 overflow-y-auto">
                    <h2 className="text-2xl font-semibold mb-6">Liste des utilisateurs</h2>

                    {/* 🔎 recherche + filtres */}
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(0);
                            }}
                            className="border rounded px-4 py-2 w-1/3"
                        />

                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPage(0);
                            }}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Tous les rôles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="USER">User</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(0);
                            }}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="BANNED">Banned</option>
                        </select>
                    </div>

                    {showForm && (
                        <UserForm
                            user={newUser}
                            errors={errors}
                            editing={!!editingUser}
                            onChange={setNewUser}
                            onCancel={() => setShowForm(false)}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {/* ✅ tableau */}
                    {loading ? (
                        <p className="text-blue-500 italic">Chargement...</p>
                    ) : users.length === 0 ? (
                        <p className="text-gray-500 italic">Aucun utilisateur trouvé</p>
                    ) : (
                        <>
                            <UserTable
                                users={users}
                                onEdit={(user) => {
                                    setEditingUser(user);
                                    setNewUser({ name: user.name, email: user.email });
                                    setShowForm(true);
                                }}
                                onDelete={setConfirmDelete}
                            />
                            <Pagination
                                page={page}
                                size={size}
                                totalElements={totalElements}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        </>
                    )}
                </main>
            </div>

            {confirmDelete && (
                <ConfirmDeleteModal
                    user={confirmDelete}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
