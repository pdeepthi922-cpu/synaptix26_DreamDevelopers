import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
}

const mockNotifications: Notification[] = [
    { id: "1", message: "You have been recommended for Frontend Developer Intern at TechCo.", read: false, createdAt: "2 hours ago" },
    { id: "2", message: "Your application for E-Commerce Platform project has been viewed.", read: false, createdAt: "5 hours ago" },
    { id: "3", message: "New internship posted matching your skills: Data Science Intern.", read: true, createdAt: "1 day ago" },
];

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center animate-fade-in">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-3 border-b border-border">
                    <h3 className="font-semibold font-heading text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                            Mark all read
                        </button>
                    )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-3 border-b border-border last:border-0 text-sm ${!n.read ? "bg-accent/50" : ""}`}
                            >
                                <p className={`${!n.read ? "font-medium" : "text-muted-foreground"}`}>{n.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{n.createdAt}</p>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationDropdown;
