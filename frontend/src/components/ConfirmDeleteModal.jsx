export default function ConfirmDeleteModal({ user, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-gray-500/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
                <p>
                    Voulez-vous vraiment supprimer{" "}
                    <span className="font-bold">{user.name}</span> ?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => onConfirm(user.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}