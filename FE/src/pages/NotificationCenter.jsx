import { useEffect, useState } from "react";

import {
  getParentNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "../api/notifications.api";

import {
  Page,
  Card,
  Button,
  Notice,
  StatusBadge,
} from "../components/ui/AppUI";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState(
    "Đang tải thông báo..."
  );

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await getParentNotificationsApi();

      const raw = res.data?.data || res.data || res;

      if (Array.isArray(raw)) {
        setNotifications(raw);
      } else if (Array.isArray(raw.items)) {
        setNotifications(raw.items);
      } else {
        setNotifications([]);
      }

      setMessage("");
    } catch (error) {
      console.error(error);
      setNotifications([]);
      setMessage("Không tải được thông báo.");
    }
  }

  async function markRead(id) {
    try {
      await markNotificationReadApi(id);

      setMessage("Đã đánh dấu đã đọc.");
      await loadNotifications();
    } catch (error) {
      console.error(error);
      setMessage("Cập nhật trạng thái thất bại.");
    }
  }

  async function markAllRead() {
    try {
      await markAllNotificationsReadApi();

      setMessage("Đã đánh dấu tất cả thông báo.");
      await loadNotifications();
    } catch (error) {
      console.error(error);
      setMessage("Không thể cập nhật tất cả thông báo.");
    }
  }

  return (
    <Page
      title="Notification Center"
      sub="Thông báo dành cho phụ huynh và theo dõi điều trị."
      actions={
        <Button onClick={markAllRead}>
          Đánh dấu tất cả
        </Button>
      }
    >
      <Notice
        type={
          message.includes("Không") ||
          message.includes("thất bại")
            ? "error"
            : message.includes("Đã")
            ? "ok"
            : "info"
        }
      >
        {message}
      </Notice>

      <div className="grid cards">
        <Card>
          <span className="metricLabel">
            Tổng thông báo
          </span>

          <strong className="metric">
            {notifications.length}
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Chưa đọc
          </span>

          <strong className="metric">
            {
              notifications.filter(
                (x) => !x.isRead
              ).length
            }
          </strong>
        </Card>

        <Card>
          <span className="metricLabel">
            Đã đọc
          </span>

          <strong className="metric">
            {
              notifications.filter(
                (x) => x.isRead
              ).length
            }
          </strong>
        </Card>
      </div>

      {!notifications.length ? (
        <Card>
          <div className="empty">
            Chưa có thông báo.
          </div>
        </Card>
      ) : (
        notifications.map((item) => {
          const id =
            item.notificationId || item.id;

          return (
            <Card key={id} title={item.title}>
              <div
                className="pageHead"
                style={{ marginBottom: 14 }}
              >
                <div>
                  <p
                    style={{
                      lineHeight: 1.7,
                    }}
                  >
                    {item.content}
                  </p>

                  <p className="hint">
                    Type:{" "}
                    {item.notificationType || "-"}{" "}
                    | Created:{" "}
                    {item.createdAt || "-"}
                  </p>
                </div>

                <div className="actions">
                  <StatusBadge>
                    {item.isRead
                      ? "Read"
                      : "Unread"}
                  </StatusBadge>

                  {!item.isRead && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        markRead(id)
                      }
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })
      )}
    </Page>
  );
}