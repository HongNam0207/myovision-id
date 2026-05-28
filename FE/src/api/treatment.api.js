import axiosClient from "./axiosClient";

export const getTreatmentPlansApi = async (patientId) =>
  axiosClient.get(`/patients/${patientId}/treatment-plans`);

export const getTreatmentPlanApi = async (planId) =>
  axiosClient.get(`/treatment-plans/${planId}`);

export const createTreatmentPlanApi = async (visitId, payload) =>
  axiosClient.post(`/visits/${visitId}/treatment-plans`, payload);

export const updateTreatmentPlanApi = async (planId, payload) =>
  axiosClient.put(`/treatment-plans/${planId}`, payload);

export const treatmentApi = {
  getByPatientId: getTreatmentPlansApi,
  getById: getTreatmentPlanApi,
  create: createTreatmentPlanApi,
  update: updateTreatmentPlanApi,
};
