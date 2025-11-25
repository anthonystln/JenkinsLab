import { useEffect, useState } from "react";
import PrivateLayout from "../layouts/PrivateLayout";
import { getCurrentUser, updateMyInfo, updateMyPassword } from "../services/userService";
import { fetchMyInvoices } from "../services/invoiceService";
import { Lock, Mail, Shield, User, Bell, Save, AlertCircle, CheckCircle, CreditCard, Calendar, Activity } from "lucide-react";

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile"); // profile, security, preferences
    const [loading, setLoading] = useState(true);

    // Form states
    const [editUser, setEditUser] = useState({ name: "", email: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState(""); // Optional if backend requires it
    const [activeSubscription, setActiveSubscription] = useState(null);

    const offers = [
        {
            id: 1,
            title: "Basic",
            price: 9,
            features: ["Accès standard", "Support basique", "1 utilisateur"],
            recommended: false,
        },
        {
            id: 2,
            title: "Pro",
            price: 19,
            features: ["Accès complet", "Support prioritaire", "5 utilisateurs"],
            recommended: true,
        },
        {
            id: 3,
            title: "Ultimate",
            price: 49,
            features: ["Toutes les fonctionnalités", "Support 24/7", "Utilisateurs illimités"],
            recommended: false,
        },
    ];

    // Feedback states
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        getCurrentUser()
            .then((u) => {
                setUser(u);
                setEditUser({ name: u.name, email: u.email });
                setLoading(false);
            })
            .catch(console.error);

        fetchMyInvoices()
            .then((invoices) => {
                const paidInvoice = invoices
                    .filter(inv => inv.status === "PAID")
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                if (paidInvoice) {
                    const offer = offers.find(o => o.price === paidInvoice.amount);
                    setActiveSubscription({
                        invoice: paidInvoice,
                        plan: offer || { title: "Personnalisé", features: [] },
                        renewalDate: new Date(new Date(paidInvoice.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000)
                    });
                }
            })
            .catch(console.error);
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    };

    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        try {
            const updated = await updateMyInfo(editUser);
            setUser(updated);
            showMessage("success", "Informations mises à jour avec succès.");
        } catch (err) {
            if (err.fieldErrors) {
                setFieldErrors(err.fieldErrors);
                showMessage("error", "Veuillez corriger les erreurs.");
            } else {
                showMessage("error", err.message || "Erreur lors de la mise à jour.");
            }
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            showMessage("error", "Le mot de passe doit faire au moins 8 caractères.");
            return;
        }
        try {
            await updateMyPassword(newPassword);
            setNewPassword("");
            showMessage("success", "Mot de passe modifié. Veuillez vous reconnecter.");
            setTimeout(() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }, 2000);
        } catch (err) {
            showMessage("error", "Erreur lors du changement de mot de passe.");
        }
    };

    if (loading) return <PrivateLayout><div className="p-8">Chargement...</div></PrivateLayout>;

    return (
        <PrivateLayout>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres du compte</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* 🔹 Sidebar Navigation */}
                    <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "profile"
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <User size={18} /> Mon Profil
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "security"
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Shield size={18} /> Sécurité
                        </button>
                        <button
                            onClick={() => setActiveTab("abonnement")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "abonnement"
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <CreditCard size={18} /> Abonnement
                        </button>
                        <button
                            onClick={() => setActiveTab("preferences")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "preferences"
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Bell size={18} /> Préférences
                        </button>
                    </nav>

                    {/* 🔹 Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[500px]">

                        {/* Feedback Message */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                }`}>
                                {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {message.text}
                            </div>
                        )}

                        {/* TAB: PROFILE */}
                        {activeTab === "profile" && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                                    <p className="text-sm text-gray-500 mt-1">Gérez vos informations de base.</p>
                                </div>

                                <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Photo de profil</p>
                                        <p className="text-sm text-gray-500">Générée automatiquement</p>
                                    </div>
                                </div>

                                <form onSubmit={handleInfoUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={editUser.name}
                                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                />
                                            </div>
                                            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={editUser.email}
                                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                />
                                            </div>
                                            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
                                            <Save size={18} /> Enregistrer les modifications
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* TAB: SECURITY */}
                        {activeTab === "security" && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Sécurité & Connexion</h2>
                                    <p className="text-sm text-gray-500 mt-1">Mettez à jour votre mot de passe et sécurisez votre compte.</p>
                                </div>

                                <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Minimum 8 caractères, incluant majuscules et symboles.</p>
                                    </div>

                                    <div className="pt-2">
                                        <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-sm font-medium">
                                            <Shield size={18} /> Mettre à jour le mot de passe
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* TAB: ABONNEMENT */}
                        {activeTab === "abonnement" && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Abonnement</h2>
                                    <p className="text-sm text-gray-500 mt-1">Gérez votre offre et vos factures.</p>
                                </div>

                                {activeSubscription ? (
                                    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white flex justify-between items-center">
                                            <div>
                                                <p className="text-blue-100 font-medium text-sm uppercase tracking-wider">Plan Actuel</p>
                                                <h2 className="text-3xl font-bold mt-1">{activeSubscription.plan.title}</h2>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                                <Activity size={18} className="text-green-300 animate-pulse" />
                                                <span className="font-semibold text-sm">Actif</span>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                            <CreditCard size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Prix mensuel</p>
                                                            <p className="font-semibold text-lg">{activeSubscription.invoice.amount} € / mois</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                            <Calendar size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Prochain renouvellement</p>
                                                            <p className="font-semibold text-lg">
                                                                {activeSubscription.renewalDate.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-5">
                                                    <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités incluses :</h3>
                                                    <ul className="space-y-2">
                                                        {activeSubscription.plan.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 border-t pt-6">
                                                <button
                                                    onClick={() => window.location.href = '/invoices'}
                                                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                                                >
                                                    Voir mes factures
                                                </button>
                                                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                                                    Changer d'offre
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 mb-4">Aucun abonnement actif.</p>
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Découvrir nos offres
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: PREFERENCES */}
                        {activeTab === "preferences" && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Préférences</h2>
                                    <p className="text-sm text-gray-500 mt-1">Personnalisez votre expérience.</p>
                                </div>

                                <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <Bell className="mx-auto text-gray-400 mb-3" size={32} />
                                    <h3 className="text-gray-900 font-medium">Notifications</h3>
                                    <p className="text-gray-500 text-sm mt-1">Les paramètres de notification seront bientôt disponibles.</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </PrivateLayout>
    );
}
