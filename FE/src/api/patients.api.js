import axiosClient from "./axiosClient";

export const getPatientsApi = async () => axiosClient.get("/patients");
export const getPatientDetailApi = async (id) => axiosClient.get(`/patients/${id}`);

export const patientApi = {
  getAll: getPatientsApi,
  getById: getPatientDetailApi,
};
