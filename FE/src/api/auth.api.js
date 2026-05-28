import axiosClient from "./axiosClient";

export const loginApi = async (payload) => {
  return axiosClient.post("/auth/login", payload);
};

export const meApi = async () => {
  return axiosClient.get("/auth/me");
};
