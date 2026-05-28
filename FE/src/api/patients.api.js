import axiosClient from "./axiosClient";

export const getPatientsApi = async () => {
  return axiosClient.get("/patients");
};

export const getPatientDetailApi = async (id) => {
  return axiosClient.get(`/patients/${id}`);
};
