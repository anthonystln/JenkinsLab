import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        console.log("🔌 Initializing WebSocket connection...");
        const socket = new SockJS("http://localhost:8082/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                const destination = `/topic/invoices/${user.id}`;
                console.log("🔔 Subscribed to", destination);

                client.subscribe(destination, (msg) => {
                    const notif = JSON.parse(msg.body);
                    console.log("📩 Notification received:", notif);
                    setNotifications((prev) => [notif, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                });
            },
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers["message"]);
                console.error("Additional details: " + frame.body);
            },
        });

        client.activate();

        return () => {
            console.log("🔌 Deactivating WebSocket connection...");
            client.deactivate();
        };
    }, [user]);

    const markAllAsRead = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}
