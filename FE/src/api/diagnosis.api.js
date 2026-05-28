import axiosClient from "./axiosClient";

export const getDiagnosisApi = async (visitId) => {
  return axiosClient.get(`/visits/${visitId}/diagnosis`);
};

export const createDiagnosisApi = async (visitId, payload) => {
  return axiosClient.post(`/visits/${visitId}/diagnosis`, payload);
};

export const updateDiagnosisApi = async (diagnosisId, payload) => {
  return axiosClient.put(`/diagnoses/${diagnosisId}`, payload);
};
