import axiosClient from "./axiosClient";

export const getRefractionsApi = async (visitId) => {
  return axiosClient.get(`/visits/${visitId}/refractions`);
};

export const createRefractionApi = async (visitId, payload) => {
  return axiosClient.post(`/visits/${visitId}/refractions`, payload);
};

export const getBiometricsApi = async (visitId) => {
  return axiosClient.get(`/visits/${visitId}/biometrics`);
};

export const createBiometricApi = async (visitId, payload) => {
  return axiosClient.post(`/visits/${visitId}/biometrics`, payload);
};

export const getBinocularVisionApi = async (visitId) => {
  return axiosClient.get(`/visits/${visitId}/binocular-vision`);
};

export const createBinocularVisionApi = async (visitId, payload) => {
  return axiosClient.post(`/visits/${visitId}/binocular-vision`, payload);
};

export const updateBinocularVisionApi = async (binocularId, payload) => {
  return axiosClient.put(`/binocular-visions/${binocularId}`, payload);
};
