import { useNavigate } from "react-router-dom";
import PrivateLayout from "../layouts/PrivateLayout";
import OfferCard from "../components/OfferCard";

export default function DashboardPage() {
    const navigate = useNavigate();

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

    return (
        <PrivateLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            </div>
        </PrivateLayout>
    );
}