import axiosClient from "./axiosClient";

export const getRefractionsApi = async (visitId) =>
  axiosClient.get(`/visits/${visitId}/refractions`);

export const createRefractionApi = async (visitId, payload) =>
  axiosClient.post(`/visits/${visitId}/refractions`, payload);

export const getBiometricsApi = async (visitId) =>
  axiosClient.get(`/visits/${visitId}/biometrics`);

export const createBiometricApi = async (visitId, payload) =>
  axiosClient.post(`/visits/${visitId}/biometrics`, payload);

export const getBinocularVisionApi = async (visitId) =>
  axiosClient.get(`/visits/${visitId}/binocular-vision`);

export const createBinocularVisionApi = async (visitId, payload) =>
  axiosClient.post(`/visits/${visitId}/binocular-vision`, payload);

export const updateBinocularVisionApi = async (binocularId, payload) =>
  axiosClient.put(`/binocular-visions/${binocularId}`, payload);

export const measurementApi = {
  getRefractions: getRefractionsApi,
  createRefraction: createRefractionApi,
  getBiometrics: getBiometricsApi,
  createBiometric: createBiometricApi,
  getBinocularVision: getBinocularVisionApi,
  createBinocularVision: createBinocularVisionApi,
  updateBinocularVision: updateBinocularVisionApi,
};
