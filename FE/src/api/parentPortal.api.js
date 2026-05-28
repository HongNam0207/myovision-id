import axiosClient from "./axiosClient";

export const getMyChildrenApi = async () => {
  return axiosClient.get("/parent-portal/my-children");
};

export const getChildDetailApi = async (patientId) => {
  return axiosClient.get(`/parent-portal/children/${patientId}`);
};

export const getChildVisitsApi = async (patientId) => {
  return axiosClient.get(`/parent-portal/children/${patientId}/visits`);
};

export const getChildProgressChartApi = async (patientId) => {
  return axiosClient.get(`/parent-portal/children/${patientId}/progress-chart`);
};

export const getChildTreatmentPlanApi = async (patientId) => {
  return axiosClient.get(`/parent-portal/children/${patientId}/treatment-plan`);
};

export const getChildReportsApi = async (patientId) => {
  return axiosClient.get(`/parent-portal/children/${patientId}/reports`);
};
