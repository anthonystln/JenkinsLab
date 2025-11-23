import './App.css'
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import InvoicesPage from './pages/InvoicesPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider> {/* ⬅️ tout est enveloppé ici */}
				<NotificationProvider>
					<Toaster position="top-right" reverseOrder={false} />
					<Routes>
						<Route path="/login" element={<LoginForm />} />
						<Route
							path="/"
							element={
								<PrivateRoute>
									<DashboardPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/users"
							element={
								<RoleRoute roles={["ADMIN"]}>
									<UsersPage />
								</RoleRoute>
							}
						/>

						{/* 🧾 Factures (privé — user connecté) */}
						<Route
							path="/invoices"
							element={
								<PrivateRoute>
									<InvoicesPage />
								</PrivateRoute>
							}
						/>

						<Route
							path="/checkout/:offerId"
							element={
								<PrivateRoute>
									<CheckoutPage />
								</PrivateRoute>
							}
						/>

						<Route
							path="/settings"
							element={
								<PrivateRoute>
									<SettingsPage />
								</PrivateRoute>
							}
						/>
					</Routes>
				</NotificationProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}