import { useEffect, useState } from "react";
import PrivateLayout from "../layouts/PrivateLayout";
import { getCurrentUser, updateMyInfo, updateMyPassword } from "../services/userService";
import { Lock, Mail, Shield, User } from "lucide-react";

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [editUser, setEditUser] = useState({ name: "", email: "" });
    const [editMode, setEditMode] = useState(false);
    const [infoErrors, setInfoErrors] = useState({ name: "", email: "" });
    const [infoMessage, setInfoMessage] = useState("");
    const [editPassword, setEditPassword] = useState(false);

    useEffect(() => {
        getCurrentUser()
            .then((u) => {
                setUser(u);
                setEditUser(u);
            })
            .catch(console.error);
    }, []);

    // ✅ Validation par champ
    const validateInfo = () => {
        let errors = { name: "", email: "" };
        let valid = true;

        if (!editUser.name || editUser.name.trim().length < 2) {
            errors.name = "Le nom doit contenir au moins 2 caractères.";
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!editUser.email || !emailRegex.test(editUser.email)) {
            errors.email = "Veuillez entrer une adresse email valide.";
            valid = false;
        }

        setInfoErrors(errors);
        return valid;
    };

    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setInfoMessage("");

        if (!validateInfo()) return;

        try {
            const updated = await updateMyInfo(editUser);

            if (user.email !== updated.email) {
                setInfoMessage("Votre email a été mis à jour. Veuillez vous reconnecter.");
                localStorage.removeItem("token");
                setTimeout(() => {
                    window.location.href = "/login?reason=relogin";
                }, 2000);
                return;
            }

            setUser(updated);
            setEditUser(updated);
            setEditMode(false);
            setInfoMessage("Profil mis à jour avec succès !");
        } catch (err) {
            setInfoErrors({ ...infoErrors, email: err.message });
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return regex.test(password);
    };

    const handlePasswordUpdate = async () => {
        setPasswordError("");
        setPasswordMessage("");

        if (!newPassword || newPassword.trim() === "") {
            setPasswordError("Veuillez saisir un mot de passe");
            return;
        }
        if (!validatePassword(newPassword)) {
            setPasswordError(
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial"
            );
            return;
        }

        try {
            await updateMyPassword(newPassword);
            setPasswordMessage("Mot de passe mis à jour avec succès. Veuillez vous reconnecter.");
            setNewPassword("");
            localStorage.removeItem("token");
            setTimeout(() => {
                window.location.href = "/login?reason=relogin";
            }, 2000);
        } catch (err) {
            setPasswordError(err.message);
        }
    };

    if (!user) return <p>Chargement...</p>;

    return (
        <PrivateLayout>
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Mon compte</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Infos utilisateur */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Mes informations</h3>

                        {!editMode ? (
                            <>
                                <p className="flex items-center gap-2 text-gray-700">
                                    <User className="text-blue-600" size={18} />
                                    <span className="font-semibold">Nom :</span> {user.name}
                                </p>
                                <p className="flex items-center gap-2 text-gray-700">
                                    <Mail className="text-blue-600" size={18} />
                                    <span className="font-semibold">Email :</span> {user.email}
                                </p>
                                <p className="flex items-center gap-2 text-gray-700">
                                    <Shield className="text-blue-600" size={18} />
                                    <span className="font-semibold">Rôle :</span> {user.role}
                                </p>
                                <p className="flex items-center gap-2 text-gray-700">
                                    <span className="font-semibold">Statut :</span> {user.status}
                                </p>

                                <button
                                    onClick={() => setEditMode(true)}
                                    className="mt-4 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Modifier mes infos
                                </button>
                            </>
                        ) : (
                            <form
                                onSubmit={handleInfoUpdate}
                                className="space-y-4 bg-gray-50 p-4 rounded-lg shadow"
                            >
                                <div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <User className="text-gray-400 mr-2" size={18} />
                                        <input
                                            type="text"
                                            value={editUser.name}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, name: e.target.value })
                                            }
                                            className="w-full outline-none"
                                            placeholder="Nom"
                                        />
                                    </div>
                                    {infoErrors.name && (
                                        <p className="text-red-500 text-sm">{infoErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center border rounded px-3 py-2">
                                        <Mail className="text-gray-400 mr-2" size={18} />
                                        <input
                                            type="email"
                                            value={editUser.email}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, email: e.target.value })
                                            }
                                            className="w-full outline-none"
                                            placeholder="Email"
                                        />
                                    </div>
                                    {infoErrors.email && (
                                        <p className="text-red-500 text-sm">{infoErrors.email}</p>
                                    )}
                                </div>

                                {infoMessage && (
                                    <p className="text-green-600 text-sm">{infoMessage}</p>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Changement mot de passe */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Changer le mot de passe</h3>

                        {!editPassword ? (
                            <>
                            <p className="text-gray-700">********</p>
                            <button
                                onClick={() => setEditPassword(true)}
                                className="mt-4 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Modifier le mot de passe
                            </button>
                            </>
                        ) : (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow">
                            <div className="flex items-center border rounded px-3 py-2">
                                <Lock className="text-gray-400 mr-2" size={18} />
                                <input
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full outline-none"
                                />
                            </div>

                            {passwordError && (
                                <p className="text-red-500 text-sm">{passwordError}</p>
                            )}
                            {passwordMessage && (
                                <p className="text-green-600 text-sm">{passwordMessage}</p>
                            )}

                            <div className="flex gap-2">
                                <button
                                onClick={handlePasswordUpdate}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                Enregistrer
                                </button>
                                <button
                                onClick={() => {
                                    setEditPassword(false);
                                    setNewPassword("");
                                    setPasswordError("");
                                    setPasswordMessage("");
                                }}
                                className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                                >
                                Annuler
                                </button>
                            </div>
                            </div>
                        )}
                        </div>
                </div>
            </div>
        </PrivateLayout>
    );
}
