import axiosClient from "./axiosClient";

export const getParentNotificationsApi = async () =>
  axiosClient.get("/parent-notifications");

export const getParentNotificationApi = async (notificationId) =>
  axiosClient.get(`/parent-notifications/${notificationId}`);

export const markNotificationReadApi = async (notificationId) =>
  axiosClient.patch(`/parent-notifications/${notificationId}/read`);

export const markAllNotificationsReadApi = async () =>
  axiosClient.patch("/parent-notifications/read-all");

export const notificationApi = {
  getAll: getParentNotificationsApi,
  getById: getParentNotificationApi,
  markRead: markNotificationReadApi,
  markAllRead: markAllNotificationsReadApi,
};
