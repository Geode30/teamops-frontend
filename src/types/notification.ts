import { useState, useEffect } from "react";

export type NotificationType = "success" | "warning" | "error";

export interface Notification {
  type: NotificationType;
  message: string;
}

export function useNotification(duration = 3000) {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification, duration]);

  return {
    notification,
    setNotification,
  };
}