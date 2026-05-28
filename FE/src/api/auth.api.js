import axiosClient from "./axiosClient";

export const loginApi = async (payload) => axiosClient.post("/auth/login", payload);
export const meApi = async () => axiosClient.get("/auth/me");

export const authApi = {
  login: loginApi,
  me: meApi,
};
