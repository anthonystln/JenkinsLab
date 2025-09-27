import { PlusCircle } from "lucide-react";

export default function Header() {
	return (
		<header className="h-16 bg-white shadow flex items-center justify-between px-6">
			<h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
			
			<div className="flex items-center gap-4">
				<button
					className="text-gray-600 hover:text-gray-900"
				>
					Mon compte
				</button>
			</div>
		</header>
	);
}