// src/components/OfferCard.jsx
import { Check } from "lucide-react";

export default function OfferCard({ title, price, features = [], onSelect, recommended = false }) {
  return (
    <div className={`relative flex flex-col p-8 bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl ${recommended ? 'border-blue-600 shadow-lg scale-105 z-10' : 'border-gray-200 hover:border-blue-300'}`}>
      {recommended && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Recommandé
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="mt-4 flex items-baseline text-gray-900">
          <span className="text-5xl font-extrabold tracking-tight">{price}€</span>
          <span className="ml-1 text-xl font-semibold text-gray-500">/mois</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">Facturation mensuelle sans engagement.</p>
      </div>

      <ul className="mt-6 space-y-4 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="ml-3 text-base text-gray-700">{f}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <button
          onClick={onSelect}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${recommended
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
        >
          {recommended ? "Commencer maintenant" : "Choisir cette offre"}
        </button>
      </div>
    </div>
  );
}
