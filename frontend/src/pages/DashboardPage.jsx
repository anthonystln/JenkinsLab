import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "../layouts/PrivateLayout";
import OfferCard from "../components/OfferCard";
import { fetchMyInvoices } from "../services/invoiceService";
import { CheckCircle, CreditCard, Calendar, Activity } from "lucide-react";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchMyInvoices()
            .then((invoices) => {
                // Trouver la dernière facture payée
                const paidInvoice = invoices
                    .filter(inv => inv.status === "PAID")
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                if (paidInvoice) {
                    // Retrouver l'offre correspondante via le montant
                    const offer = offers.find(o => o.price === paidInvoice.amount);
                    setActiveSubscription({
                        invoice: paidInvoice,
                        plan: offer || { title: "Personnalisé", features: [] },
                        renewalDate: new Date(new Date(paidInvoice.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000) // J+30 simulé
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <PrivateLayout><div className="p-10 text-center">Chargement...</div></PrivateLayout>;

    return (
        <PrivateLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {activeSubscription ? (
                    // ✅ VUE ABONNÉ
                    // ✅ VUE ABONNÉ - MISSION CONTROL (Bientôt)
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-900">Mission Control</h1>
                            <p className="mt-2 text-gray-500">Pilotez votre infrastructure en temps réel.</p>
                        </div>

                        <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 p-12 text-center relative">
                            {/* Background Grid Effect */}
                            <div className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                            </div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <Activity size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Initialisation du système...</h2>
                                <p className="text-slate-400 max-w-lg mx-auto mb-8">
                                    Votre abonnement <strong>{activeSubscription.plan.title}</strong> est actif.
                                    Le tableau de bord de supervision des drones est en cours de déploiement.
                                </p>
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/50">
                                    Configurer mes premiers assets
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // 🛍️ VUE NOUVEAU CLIENT (Offres)
                    <>
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                                Choisissez l'offre qui vous correspond
                            </h1>
                            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                                Des solutions flexibles pour accompagner votre croissance. Changez d'offre à tout moment.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
                            {offers.map((offer) => (
                                <OfferCard
                                    key={offer.id}
                                    {...offer}
                                    onSelect={() => navigate(`/checkout/${offer.id}`)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </PrivateLayout>
    );
}