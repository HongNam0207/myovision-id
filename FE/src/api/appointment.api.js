import axiosClient from "./axiosClient";

export const getAppointmentsApi = async () =>
  axiosClient.get("/appointments");

export const getAppointmentApi = async (appointmentId) =>
  axiosClient.get(`/appointments/${appointmentId}`);

export const createAppointmentApi = async (payload) =>
  axiosClient.post("/appointments", payload);

export const updateAppointmentApi = async (appointmentId, payload) =>
  axiosClient.put(`/appointments/${appointmentId}`, payload);

export const updateAppointmentStatusApi = async (appointmentId, status) =>
  axiosClient.patch(`/appointments/${appointmentId}/status`, { status });

export const appointmentApi = {
  getAll: getAppointmentsApi,
  getById: getAppointmentApi,
  create: createAppointmentApi,
  update: updateAppointmentApi,
  updateStatus: updateAppointmentStatusApi,
};
