import PrivateLayout from "../layouts/PrivateLayout";

export default function DashboardPage() {
    return (
        <PrivateLayout>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600">Bienvenue sur le tableau de bord 👋</p>
        </PrivateLayout>
    );
}