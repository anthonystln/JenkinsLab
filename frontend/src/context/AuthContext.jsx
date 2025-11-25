// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Chargement du user au démarrage si token existe
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Connexion → enregistre le token, charge le profil et redirige
  const login = async ({ email, password }) => {
    const res = await fetch("http://localhost:8082/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const data = JSON.parse(errorText);
        throw new Error(data.error || errorText);
      } catch (e) {
        throw new Error(errorText || "Identifiants invalides");
      }
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      navigate("/", { replace: true }); // ✅ redirection unique ici
    } catch (err) {
      console.error("❌ Erreur profil:", err);
      logout();
      throw err;
    }
  };

  // ✅ Déconnexion → supprime tout et redirige vers /login
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);