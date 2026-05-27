import axiosClient from "./axiosClient";

export const measurementApi = {
  getRefractions: (visitId) =>
    axiosClient.get(`/visits/${visitId}/refractions`),

  createRefraction: (visitId, data) =>
    axiosClient.post(`/visits/${visitId}/refractions`, data),

  updateRefraction: (refractionId, data) =>
    axiosClient.put(`/refractions/${refractionId}`, data),

  deleteRefraction: (refractionId) =>
    axiosClient.delete(`/refractions/${refractionId}`),

  getBiometrics: (visitId) =>
    axiosClient.get(`/visits/${visitId}/biometrics`),

  createBiometric: (visitId, data) =>
    axiosClient.post(`/visits/${visitId}/biometrics`, data),

  updateBiometric: (biometricId, data) =>
    axiosClient.put(`/biometrics/${biometricId}`, data),

  deleteBiometric: (biometricId) =>
    axiosClient.delete(`/biometrics/${biometricId}`),
};
