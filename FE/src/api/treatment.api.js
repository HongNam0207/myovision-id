import axiosClient from "./axiosClient";

export const getTreatmentPlansByPatientApi = async (patientId) => {
  return axiosClient.get(`/patients/${patientId}/treatment-plans`);
};

export const getTreatmentPlanDetailApi = async (planId) => {
  return axiosClient.get(`/treatment-plans/${planId}`);
};

export const createTreatmentPlanApi = async (visitId, payload) => {
  return axiosClient.post(`/visits/${visitId}/treatment-plans`, payload);
};

export const updateTreatmentPlanApi = async (planId, payload) => {
  return axiosClient.put(`/treatment-plans/${planId}`, payload);
};

export const updateTreatmentPlanStatusApi = async (planId, status) => {
  return axiosClient.patch(`/treatment-plans/${planId}/status`, { status });
};
