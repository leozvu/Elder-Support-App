import React, { createContext, useContext, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
  Bell,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  link?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
};

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Calculate unread count
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Add a new notification
  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default",
    });
  };

  // Sample notifications for demo purposes
  useEffect(() => {
    // Simulate receiving notifications
    const sampleNotifications: Omit<
      Notification,
      "id" | "timestamp" | "read"
    >[] = [
      {
        title: "New Helper Assigned",
        message:
          "Sarah Johnson has been assigned to your shopping assistance request.",
        type: "success",
        link: "/tracking/REQ-12345",
      },
      {
        title: "Upcoming Service Reminder",
        message:
          "You have a medical appointment scheduled for tomorrow at 10:00 AM.",
        type: "info",
        link: "/tracking/REQ-12346",
      },
      {
        title: "Helper Arrival",
        message: "Your helper is 10 minutes away from your location.",
        type: "info",
        link: "/tracking/REQ-12345",
      },
    ];

    // Add sample notifications with a delay
    const timer = setTimeout(() => {
      sampleNotifications.forEach((notification, index) => {
        setTimeout(() => {
          addNotification(notification);
        }, index * 3000); // Add each notification with a 3-second delay
      });
    }, 5000); // Initial delay of 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <Toaster />
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
