import axiosClient from "./axiosClient";

export const getClinicalIntakeApi = async (visitId) => {
  return axiosClient.get(`/visits/${visitId}/clinical-intake`);
};

export const createClinicalIntakeApi = async (visitId, payload) => {
  return axiosClient.post(`/visits/${visitId}/clinical-intake`, payload);
};
