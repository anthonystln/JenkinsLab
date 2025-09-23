import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserForm from "../components/UserForm";
import UserCard from "../components/UserCard";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { toast } from "react-hot-toast";
import { getUsers, addUser, updateUser, deleteUser } from "../services/userService";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "" });
    const [editingUser, setEditingUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [errors, setErrors] = useState({ name: "", email: "" });
    
    useEffect(() => {
        getUsers().then(setUsers);
    }, []);

    // Validation
    const validateForm = () => {
        let valid = true;
        let newErrors = { name: "", email: "" };

        if (!newUser.name.trim()) {
            newErrors.name = "Le nom est requis.";
            valid = false;
        }
        if (!newUser.email.trim()) {
            newErrors.email = "L'email est requis.";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (editingUser) {
                await updateUser(editingUser.id, newUser);
                setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...newUser } : u)));
                toast.success("Utilisateur mis à jour");
            } else {
                const created = await addUser(newUser);
                setUsers([...users, created]);
                toast.success("Utilisateur ajouté");
            }
    
            setNewUser({ name: "", email: "" });
            setErrors({ name: "", email: "" });
            setEditingUser(null);
            setShowForm(false);
        } catch (err) {
            toast.error("Erreur lors de l'enregistrement");
        }

    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
            setConfirmDelete(null);
            toast.success("Utilisateur supprimé");
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((u) => (
                            <UserCard
                                key={u.id}
                                user={u}
                                onEdit={(user) => {
                                    setEditingUser(user);
                                    setNewUser({ name: user.name, email: user.email });
                                    setShowForm(true);
                                }}
                                onDelete={setConfirmDelete}
                            />
                        ))}
                    </div>
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