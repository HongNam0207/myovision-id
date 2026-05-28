import { useEffect, useState } from "react";
import {
  getParentNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "../api/notifications.api";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await getParentNotificationsApi();
      const data = res.data ?? res;

      if (Array.isArray(data)) setNotifications(data);
      else if (Array.isArray(data.items)) setNotifications(data.items);
      else setNotifications([]);
    } catch (error) {
      console.error(error);
      setNotifications([]);
    }
  }

  async function markRead(id) {
    try {
      await markNotificationReadApi(id);
      await loadNotifications();
    } catch (error) {
      console.error(error);
    }
  }

  async function markAllRead() {
    try {
      await markAllNotificationsReadApi();
      await loadNotifications();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
          <p className="text-slate-500">Parent notifications</p>
        </div>

        <button
          onClick={markAllRead}
          className="rounded-xl bg-blue-600 px-4 py-3 text-white"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow">No notifications</div>
        ) : (
          notifications.map((item) => {
            const id = item.notificationId || item.id;

            return (
              <div key={id} className="rounded-2xl bg-white p-6 shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="mt-2 text-slate-600">{item.content}</p>
                    <p className="mt-3 text-sm text-slate-400">
                      Type: {item.notificationType} | Created: {item.createdAt}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isRead ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-700"
                    }`}>
                      {item.isRead ? "Read" : "Unread"}
                    </span>

                    {!item.isRead && (
                      <button
                        onClick={() => markRead(id)}
                        className="mt-3 block rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
