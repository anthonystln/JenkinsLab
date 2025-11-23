const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api";
const token = () => localStorage.getItem("token") || "";

export async function fetchMyInvoices() {
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`${API_URL}/invoices/me`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erreur lors du chargement des factures");
    return res.json();
}

export async function createInvoice(userId, amount, status) {
    const res = await fetch(`${API_URL}/invoices`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
            userId,
            amount,
            status,
        }),
    });

    if (!res.ok) {
        throw new Error("Erreur lors de la création de la facture");
    }

    return res.json();
}