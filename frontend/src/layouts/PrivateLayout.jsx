import Header from "../components/Header";


export default function PrivateLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 w-full">
                {children}
            </main>
        </div>
    );
}