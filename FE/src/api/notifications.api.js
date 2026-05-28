import axiosClient from "./axiosClient";

export const getParentNotificationsApi = async () => {
  return axiosClient.get("/parent-notifications");
};

export const getParentNotificationDetailApi = async (notificationId) => {
  return axiosClient.get(`/parent-notifications/${notificationId}`);
};

export const createParentNotificationApi = async (payload) => {
  return axiosClient.post("/parent-notifications", payload);
};

export const markNotificationReadApi = async (notificationId) => {
  return axiosClient.patch(`/parent-notifications/${notificationId}/read`);
};

export const markAllNotificationsReadApi = async () => {
  return axiosClient.patch("/parent-notifications/read-all");
};
