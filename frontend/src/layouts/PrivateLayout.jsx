import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function PrivateLayout({ children }) {
    return (
        <div className="h-screen w-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Contenu de la page */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}