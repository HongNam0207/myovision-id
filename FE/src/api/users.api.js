import axiosClient from "./axiosClient";

export const getUsersApi = async () => axiosClient.get("/users");
export const getUserApi = async (userId) => axiosClient.get(`/users/${userId}`);
export const createUserApi = async (payload) => axiosClient.post("/users", payload);
export const updateUserApi = async (userId, payload) => axiosClient.put(`/users/${userId}`, payload);
export const updateUserStatusApi = async (userId, status) =>
  axiosClient.patch(`/users/${userId}/status`, { status });

export const userApi = {
  getAll: getUsersApi,
  getById: getUserApi,
  create: createUserApi,
  update: updateUserApi,
  updateStatus: updateUserStatusApi,
};
