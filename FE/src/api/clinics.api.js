import axiosClient from "./axiosClient";

export const getClinicsApi = async () => axiosClient.get("/clinics");
export const getClinicApi = async (clinicId) => axiosClient.get(`/clinics/${clinicId}`);
export const createClinicApi = async (payload) => axiosClient.post("/clinics", payload);
export const updateClinicApi = async (clinicId, payload) => axiosClient.put(`/clinics/${clinicId}`, payload);
export const updateClinicStatusApi = async (clinicId, isActive) =>
  axiosClient.patch(`/clinics/${clinicId}/status`, { isActive });

export const clinicApi = {
  getAll: getClinicsApi,
  getById: getClinicApi,
  create: createClinicApi,
  update: updateClinicApi,
  updateStatus: updateClinicStatusApi,
};
