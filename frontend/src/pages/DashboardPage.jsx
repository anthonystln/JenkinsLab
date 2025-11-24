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
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-900">Mon Abonnement</h1>
                            <p className="mt-2 text-gray-500">Gérez votre offre et vos factures.</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
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
                                        onClick={() => navigate('/invoices')}
                                        className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                                    >
                                        Voir mes factures
                                    </button>
                                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                                        Gérer l'abonnement
                                    </button>
                                </div>
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