import axiosClient from "./axiosClient";

export const getMyChildrenApi = async () =>
  axiosClient.get("/parent-portal/my-children");

export const getChildProfileApi = async (patientId) =>
  axiosClient.get(`/parent-portal/children/${patientId}`);

export const getChildVisitsApi = async (patientId) =>
  axiosClient.get(`/parent-portal/children/${patientId}/visits`);

export const getChildProgressApi = async (patientId) =>
  axiosClient.get(`/parent-portal/children/${patientId}/progress`);

export const getChildTreatmentPlanApi = async (patientId) =>
  axiosClient.get(`/parent-portal/children/${patientId}/treatment-plan`);

export const getChildReportsApi = async (patientId) =>
  axiosClient.get(`/parent-portal/children/${patientId}/reports`);

export const parentPortalApi = {
  getMyChildren: getMyChildrenApi,
  getChildProfile: getChildProfileApi,
  getChildVisits: getChildVisitsApi,
  getChildProgress: getChildProgressApi,
  getChildTreatmentPlan: getChildTreatmentPlanApi,
  getChildReports: getChildReportsApi,
};
