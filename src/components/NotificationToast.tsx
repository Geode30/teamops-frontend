import { useNotification } from "../context/NotificationContext";
import { Alert } from "./Alert";

export default function NotificationToast() {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <Alert
        variant={notification.type}
        message={notification.message}
      />
    </div>
  );
}