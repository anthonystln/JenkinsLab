import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Badge } from "./ui/badge";
import NotificationList from "./NotificationList";

export default function NotificationBell({ unread, notifications, onOpen }) {
    return (
        <Popover onOpenChange={onOpen}>
            <PopoverTrigger className="relative p-2 rounded hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-700" />

                {unread > 0 && (
                    <span className="
                        absolute -top-1 -right-1
                        bg-red-600 text-white 
                        text-xs font-bold 
                        h-5 w-5 flex items-center justify-center 
                        rounded-full shadow
                    ">
                        {unread}
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0">
                <NotificationList notifications={notifications}/>
            </PopoverContent>
        </Popover>
    );
}