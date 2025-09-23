const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

async function handleResponse(res) {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw errorData; // on renvoie les erreurs du backend
    }
    return res.json();
}

export async function getUsers() {
    const res = await fetch(`${API_URL}/users`);
    return handleResponse(res);
}

export async function addUser(user) {
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return handleResponse(res);
}

export async function updateUser(id, user) {
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return handleResponse(res);
}

export async function deleteUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
}