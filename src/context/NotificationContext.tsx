import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type NotificationType = "success" | "warning" | "error";

export interface Notification {
  type: NotificationType;
  message: string;
}

interface NotificationContextValue {
  notification: Notification | null;
  setNotification: (n: Notification | null) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
        setNotification(null);
    }, 1500);

    return () => clearTimeout(timer);
    }, [notification]);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
}