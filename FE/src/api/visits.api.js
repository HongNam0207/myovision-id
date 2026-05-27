import axiosClient from "./axiosClient";

export const visitApi = {
  getAll: () => axiosClient.get("/visits"),

  getById: (id) => axiosClient.get(`/visits/${id}`),

  getSummary: (id) => axiosClient.get(`/visits/${id}/summary`),

  getFullRecord: (id) => axiosClient.get(`/visits/${id}/full-record`),

  create: (data) => axiosClient.post("/visits", data),

  updateStatus: (id, data) =>
    axiosClient.patch(`/visits/${id}/status`, data),
};
