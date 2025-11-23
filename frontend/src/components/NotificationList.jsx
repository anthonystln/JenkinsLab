export default function NotificationList({ notifications }) {
    if (notifications.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-gray-500">
                Aucune notification
            </div>
        );
    }

    return (
        <div className="max-h-80 overflow-y-auto divide-y">
            {notifications.map((n, i) => (
                <div key={i} className="p-3 text-sm">
                    <div className="font-medium">{n.message}</div>
                    <div className="text-gray-600 text-xs">
                        ID: {n.invoiceId ?? "?"} - Status: {n.status}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}