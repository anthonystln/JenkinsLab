import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");
	const { login } = useAuth();
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		if (params.get("reason") === "relogin") {
			setInfo("Veuillez vous reconnecter suite à la mise à jour de vos informations.");
		}
	}, [location]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			await login({ email, password });
		} catch (err) {
			setError("Erreur de connexion : " + err.message);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<form
			onSubmit={handleSubmit}
			className="bg-white p-8 rounded shadow-md w-96"
			>
			<h2 className="text-2xl font-semibold mb-6">Connexion</h2>

			{/* 🔥 Affichage du message si déconnexion forcée */}
			{info && <p className="text-blue-600 mb-4 text-sm">{info}</p>}

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">Email</label>
				<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="mt-1 block w-full border rounded px-3 py-2"
				required
				/>
			</div>

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
				Mot de passe
				</label>
				<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="mt-1 block w-full border rounded px-3 py-2"
				required
				/>
			</div>

			<button
				type="submit"
				className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
			>
				Se connecter
			</button>
			</form>
		</div>
	);
}
