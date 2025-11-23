import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrivateLayout from "../layouts/PrivateLayout";
import { createInvoice } from "../services/invoiceService";
import { useAuth } from "../context/AuthContext";

const offers = [
  { id: 1, title: "Basic", price: 9 },
  { id: 2, title: "Pro", price: 19 },
  { id: 3, title: "Ultimate", price: 49 },
];

export default function CheckoutPage() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();              // 👈 récupère l'utilisateur connecté

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const selected = offers.find((o) => o.id === Number(offerId));
    if (!selected) {
      navigate("/");
      return;
    }

    setOffer(selected);
    setLoading(false);
  }, [offerId, navigate]);

  if (loading) {
    return (
      <PrivateLayout>
        <p>Chargement...</p>
      </PrivateLayout>
    );
  }

  const validateInputs = () => {
    if (!user || !user.id) {
      setError("Utilisateur non chargé, veuillez vous reconnecter.");
      return false;
    }
    if (cardNumber.trim().length < 16) {
      setError("Numéro de carte invalide");
      return false;
    }
    if (!expiry.includes("/") || expiry.trim().length < 4) {
      setError("Date d’expiration invalide (MM/YY)");
      return false;
    }
    if (cvv.trim().length < 3) {
      setError("CVC invalide");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    setError("");

    if (!validateInputs()) return;

    setProcessing(true);

    try {
      // 👇 on passe maintenant user.id explicitement
      await createInvoice(user.id, offer.price, "PENDING");
      navigate("/invoices");
    } catch (e) {
      console.error(e);
      setError("Erreur lors du paiement.");
      setProcessing(false);
    }
  };

  const isValid =
    cardNumber.length >= 16 && expiry.length >= 4 && cvv.length >= 3 && !!user?.id;

  return (
    <PrivateLayout>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-sm mt-6">
        <h1 className="text-2xl font-bold mb-4">
          Paiement de l’offre {offer.title}
        </h1>

        <p className="text-gray-700">
          Montant : <span className="font-semibold">{offer.price} €</span>
        </p>

        <div className="mt-6 border p-4 rounded-lg">
          <p className="font-semibold mb-2">Carte bancaire (test)</p>

          <div className="space-y-3">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Numéro de carte (fake)"
            />
            <div className="flex gap-3">
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-1/2 p-2 border rounded"
                placeholder="MM/YY"
              />
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-1/2 p-2 border rounded"
                placeholder="CVC"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        <button
          onClick={handlePayment}
          disabled={!isValid || processing}
          className={`mt-6 w-full py-2 rounded-md text-white transition ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {processing ? "Traitement..." : "Payer"}
        </button>
      </div>
    </PrivateLayout>
  );
}
