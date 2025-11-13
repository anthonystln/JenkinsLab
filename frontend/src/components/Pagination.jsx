export default function Pagination({ page, size, totalElements, onPageChange, onSizeChange }) {
    const totalPages = Math.max(1, Math.ceil(totalElements / size));

    return (
        <div className="flex justify-between items-center mt-6 px-4">
            {/* Infos */}
            <div className="text-sm text-gray-600">
                Page {page + 1} sur {totalPages} — {totalElements} utilisateurs
            </div>

            {/* Sélecteur taille de page */}
            <div className="flex items-center gap-2">
                <label htmlFor="size" className="text-sm text-gray-600">
                    Afficher
                </label>
                <select
                    id="size"
                    value={size}
                    onChange={(e) => onSizeChange(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                >
                    {[5, 10, 20, 50].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Boutons */}
            <div className="flex items-center gap-4">
                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                    ← Précédent
                </button>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                    Suivant →
                </button>
            </div>
        </div>
    );
}
