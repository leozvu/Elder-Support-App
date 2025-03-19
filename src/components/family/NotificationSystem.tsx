import React, { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  type: "medication" | "wellness" | "service" | "emergency" | "general";
  message: string;
  time: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  relatedTo?: string; // ID of related entity (medication, senior, etc.)
}

interface NotificationSystemProps {
  userId: string;
  role: "caregiver" | "senior";
  onNotificationClick?: (notification: Notification) => void;
  maxNotifications?: number;
}

const NotificationSystem = ({
  userId,
  role,
  onNotificationClick,
  maxNotifications = 5,
}: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  // Mock data - in a real app, this would come from the database
  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications: Notification[] = [
      {
        id: "notif1",
        type: "medication",
        message: "Martha missed her evening Simvastatin dose",
        time: "2 hours ago",
        read: false,
        priority: "high",
        relatedTo: "med3",
      },
      {
        id: "notif2",
        type: "wellness",
        message: "Elizabeth's blood pressure reading is above normal range",
        time: "Yesterday",
        read: false,
        priority: "medium",
        relatedTo: "well1",
      },
      {
        id: "notif3",
        type: "service",
        message: "Transportation service for doctor's appointment confirmed",
        time: "Yesterday",
        read: true,
        priority: "low",
        relatedTo: "serv1",
      },
      {
        id: "notif4",
        type: "wellness",
        message: "Daily wellness check completed successfully",
        time: "2 days ago",
        read: true,
        priority: "low",
      },
      {
        id: "notif5",
        type: "medication",
        message: "Medication refill reminder: Lisinopril (3 days remaining)",
        time: "2 days ago",
        read: true,
        priority: "medium",
        relatedTo: "med1",
      },
    ];

    setNotifications(mockNotifications);

    // Simulate receiving a new notification after 5 seconds
    const timer = setTimeout(() => {
      const newNotification: Notification = {
        id: "notif6",
        type: "medication",
        message: "Time to take your morning medication: Lisinopril",
        time: "Just now",
        read: false,
        priority: "high",
        relatedTo: "med1",
      };

      setNotifications((prev) => [newNotification, ...prev]);

      toast({
        title: "Medication Reminder",
        description: "Time to take your morning medication: Lisinopril",
        duration: 5000,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification.id, {
        stopPropagation: () => {},
      } as React.MouseEvent);
    }

    // Call the provided callback if available
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-red-50";
      case "medium":
        return "border-yellow-300 bg-yellow-50";
      case "low":
        return "border-blue-300 bg-blue-50";
      default:
        return "border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <span className="text-blue-500">💊</span>;
      case "wellness":
        return <span className="text-green-500">❤️</span>;
      case "service":
        return <span className="text-purple-500">🚗</span>;
      case "emergency":
        return <span className="text-red-500">🚨</span>;
      default:
        return <span className="text-gray-500">📌</span>;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
            variant="destructive"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 sm:w-96 z-50 shadow-lg">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-8 text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-2 py-2 max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications
                  .slice(0, maxNotifications)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${getPriorityStyles(notification.priority)} ${!notification.read ? "font-medium" : "opacity-80"}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div>
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => handleDismiss(notification.id, e)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                {notifications.length > maxNotifications && (
                  <Button variant="link" className="w-full text-sm" size="sm">
                    View all {notifications.length} notifications
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4 text-sm">
                No notifications at this time
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSystem;
