import axiosClient from "./axiosClient";

export const patientApi = {
  getAll: () => axiosClient.get("/patients"),

  getById: (id) => axiosClient.get(`/patients/${id}`),

  create: (data) => axiosClient.post("/patients", data),

  update: (id, data) =>
    axiosClient.put(`/patients/${id}`, data),
};
