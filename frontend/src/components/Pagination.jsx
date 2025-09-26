export default function Pagination({ page, size, totalElements, onPageChange }) {
    const totalPages = Math.ceil(totalElements / size);

    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                disabled={page === 0}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                ← Précédent
            </button>
            <span>
                Page {page + 1} / {totalPages}
            </span>
            <button
                disabled={page + 1 >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Suivant →
            </button>
        </div>
    );
}
