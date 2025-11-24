import { useEffect, useState } from "react";
import { fetchMyInvoices } from "../services/invoiceService";
import PrivateLayout from "../layouts/PrivateLayout";
import { FileText } from "lucide-react";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchMyInvoices();
                setInvoices(data);
            } catch (err) {
                console.error("Erreur:", err);
            }
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return <p className="text-gray-600">Chargement des factures...</p>;
    }

    return (
        <PrivateLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 🔹 Breadcrumb léger */}
                <p className="text-sm text-gray-400 mb-2">Accueil / Factures</p>

                <h1 className="text-3xl font-semibold mb-6">Mes factures</h1>

                {/* 🧾 Aucune facture */}
                {invoices.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">
                        <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                        Aucune facture pour le moment.
                    </div>
                ) : (
                    <div className="bg-white shadow-sm border rounded-xl">
                        {/* Header tableau */}
                        <div className="grid grid-cols-4 px-5 py-3 border-b text-sm font-semibold text-gray-500">
                            <div>ID</div>
                            <div>Montant</div>
                            <div>Statut</div>
                            <div>Date</div>
                        </div>

                        {/* Lignes */}
                        {invoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="grid grid-cols-4 px-5 py-4 border-b hover:bg-gray-50 transition"
                            >
                                {/* ID */}
                                <div className="font-medium text-gray-700">
                                    #{inv.id}
                                </div>

                                {/* Montant */}
                                <div className="text-gray-800 font-semibold">
                                    {inv.amount} €
                                </div>

                                {/* Badge statut */}
                                <div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-md font-medium ${inv.status === "PAID"
                                                ? "bg-green-100 text-green-700"
                                                : inv.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        {inv.status}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="text-gray-600">
                                    {inv.createdAt
                                        ? new Date(inv.createdAt).toLocaleString()
                                        : "—"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PrivateLayout>
    );
}