import { useNotification } from './NotificationContext';
import './Toast.css';

const icons = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
  reminder: '🔔',
};

const titles = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  reminder: 'Reminder',
};

export function ToastContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`toast toast-${notification.type}`}
        >
          <div className="toast-icon-wrapper">
            <span className="toast-icon">{icons[notification.type]}</span>
          </div>
          <div className="toast-content">
            <p className="toast-title">{titles[notification.type]}</p>
            <p className="toast-message">{notification.message}</p>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
