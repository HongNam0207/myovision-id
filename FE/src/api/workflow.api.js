import axiosClient from "./axiosClient";

export const startIntakeApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/start-intake`);
};

export const finishIntakeApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/finish-intake`);
};

export const startMeasurementApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/start-measurement`);
};

export const finishMeasurementApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/finish-measurement`);
};

export const startDiagnosisApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/start-diagnosis`);
};

export const finishDiagnosisApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/finish-diagnosis`);
};

export const completeVisitApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/complete`);
};

export const cancelVisitApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/cancel`);
};
