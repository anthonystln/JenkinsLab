const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api";

// 🔄 Récupère les utilisateurs (recherche + filtres + pagination)
export async function fetchUsers({
  query = "",
  role = "",
  status = "",
  page = 0,
  size = 6,
  sortField = "name",
  sortDirection = "ASC",
} = {}) {
  const token = localStorage.getItem("token") || "";

  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: `${sortField},${sortDirection}`,
  });

  if (query) params.append("q", query);
  if (role) params.append("role", role);
  if (status) params.append("status", status);

  const res = await fetch(`${API_URL}/users/all?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  return res.json();
}

// 👤 Récupère l'utilisateur courant
export async function getCurrentUser() {
  const token = localStorage.getItem("token") || "";

  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur lors de la récupération du profil");
  return res.json();
}

// ⚡ Ajout utilisateur
export async function addUser(user) {
  const token = localStorage.getItem("token") || "";

  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      role: user.role || "USER",
      status: user.status || "ACTIVE",
      password: null,
    }),
  });

  if (!res.ok) throw new Error("Erreur lors de l’ajout");
  return res.json();
}

// ✏️ Mise à jour utilisateur
export async function updateUser(id, user) {
  const token = localStorage.getItem("token") || "";

  // construire l'objet sans password si vide
  const payload = {
    name: user.name,
    email: user.email,
    role: user.role || "USER",
    status: user.status || "ACTIVE",
  };

  if (user.password && user.password.trim() !== "") {
    payload.password = user.password;
  }

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return res.json();
}

// 🔑 Mise à jour du mot de passe utilisateur connecté
export async function updateMyPassword(newPassword) {
  const token = localStorage.getItem("token") || "";

  const res = await fetch(`${API_URL}/users/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!res.ok) throw new Error("Erreur lors de la mise à jour du mot de passe");
  return res.text();
}

// Mise à jour des infos de l'utilisateur connecté
export async function updateMyInfo(data) {
	const token = localStorage.getItem("token") || "";

	const res = await fetch(`${API_URL}/users/me`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
      		Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.error || "Erreur lors de la mise à jour du profil");
	}
	return res.json();
}

// ❌ Suppression utilisateur
export async function deleteUser(id) {
  const token = localStorage.getItem("token") || "";

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return true;
}
