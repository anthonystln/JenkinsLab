const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api"; 

// 🔄 Récupère les utilisateurs (recherche + filtres + pagination)
export async function fetchUsers({ query = "", role = "", status = "", page = 0, size = 6 } = {}) {
    const params = new URLSearchParams({ page, size });

    if (query) params.append("q", query);
    if (role) params.append("role", role);
    if (status) params.append("status", status);

    // 👉 si aucun filtre, on utilise /search
    // const endpoint = query || role || status ? "filter" : "search";
    let endpoint = "search";
    if (role || status) {
        endpoint = "filter";
    }

    const res = await fetch(`${API_URL}/users/${endpoint}?${params.toString()}`);
    if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
    return res.json();
}


// ⚡ Ajout
export async function addUser(user) {
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Erreur lors de l’ajout");
    return res.json();
}

// ⚡ Update
export async function updateUser(id, user) {
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    return res.json();
}

// ⚡ Suppression
export async function deleteUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return true;
}
