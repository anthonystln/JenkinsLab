import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";

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
			const message = err.response?.data || err.message || "Erreur de connexion";
			setError(message);
		}
	};

	return (
		<div className="min-h-screen flex bg-white">
			{/* 🎨 Left Side - Visual & Branding */}
			<div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
					</svg>
				</div>

				<div className="relative z-10">
					<div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
						<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
							<span className="text-white text-lg">J</span>
						</div>
						JenkinsLab
					</div>
				</div>

				<div className="relative z-10 max-w-md">
					<h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
						Manage your business with confidence.
					</h1>
					<p className="text-lg text-slate-400 mb-8">
						Rejoignez des milliers d'entreprises qui utilisent JenkinsLab pour piloter leur croissance et simplifier leur gestion.
					</p>

					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<CheckCircle className="text-blue-500" size={20} />
							<span className="text-slate-300">Tableau de bord analytique complet</span>
						</div>
						<div className="flex items-center gap-3">
							<CheckCircle className="text-blue-500" size={20} />
							<span className="text-slate-300">Gestion des utilisateurs et des rôles</span>
						</div>
						<div className="flex items-center gap-3">
							<CheckCircle className="text-blue-500" size={20} />
							<span className="text-slate-300">Facturation automatisée</span>
						</div>
					</div>
				</div>

				<div className="relative z-10 text-sm text-slate-500">
					© 2024 JenkinsLab Inc. All rights reserved.
				</div>
			</div>

			{/* 📝 Right Side - Login Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
				<div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900">Bon retour !</h2>
						<p className="text-gray-500 mt-2">Connectez-vous pour accéder à votre espace.</p>
					</div>

					{info && (
						<div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
							<CheckCircle size={16} />
							{info}
						</div>
					)}

					{error && (
						<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									placeholder="nom@entreprise.com"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									placeholder="••••••••"
									required
								/>
							</div>
						</div>

						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
								<span className="text-gray-600">Se souvenir de moi</span>
							</label>
							<a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
								Mot de passe oublié ?
							</a>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
						>
							Se connecter
							<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
						</button>
					</form>

					<p className="mt-8 text-center text-sm text-gray-500">
						Pas encore de compte ?{" "}
						<a href="#" className="text-blue-600 font-medium hover:underline">
							Créer un compte
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
