import './App.css'
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<DashboardPage />}/>
				<Route path="/users" element={<UsersPage />}/>
				<Route path="/settings" element={<SettingsPage />} />
			</Routes>
		</BrowserRouter>
	);
}