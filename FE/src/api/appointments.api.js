import axiosClient from "./axiosClient";

export const getAppointmentsApi = async () => {
  return axiosClient.get("/appointments");
};

export const getAppointmentDetailApi = async (appointmentId) => {
  return axiosClient.get(`/appointments/${appointmentId}`);
};

export const createAppointmentApi = async (payload) => {
  return axiosClient.post("/appointments", payload);
};

export const updateAppointmentStatusApi = async (appointmentId, status) => {
  return axiosClient.patch(`/appointments/${appointmentId}/status`, { status });
};
