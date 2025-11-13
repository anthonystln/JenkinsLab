import './App.css'
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider> {/* ⬅️ tout est enveloppé ici */}
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
						<Route
							path="/settings"
							element={
								<PrivateRoute>
									<SettingsPage />
								</PrivateRoute>
							}
						/>
					</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}