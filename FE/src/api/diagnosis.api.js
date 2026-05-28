import axiosClient from "./axiosClient";

export const getDiagnosisApi = async (visitId) =>
  axiosClient.get(`/visits/${visitId}/diagnosis`);

export const createDiagnosisApi = async (visitId, payload) =>
  axiosClient.post(`/visits/${visitId}/diagnosis`, payload);

export const updateDiagnosisApi = async (diagnosisId, payload) =>
  axiosClient.put(`/diagnoses/${diagnosisId}`, payload);

export const diagnosisApi = {
  getByVisitId: getDiagnosisApi,
  create: createDiagnosisApi,
  update: updateDiagnosisApi,
};
