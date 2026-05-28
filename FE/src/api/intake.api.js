import axiosClient from "./axiosClient";

export const getClinicalIntakeApi = async (visitId) =>
  axiosClient.get(`/visits/${visitId}/clinical-intake`);

export const createClinicalIntakeApi = async (visitId, payload) =>
  axiosClient.post(`/visits/${visitId}/clinical-intake`, payload);

export const intakeApi = {
  getByVisitId: getClinicalIntakeApi,
  create: createClinicalIntakeApi,
};
