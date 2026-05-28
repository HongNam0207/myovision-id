import axiosClient from "./axiosClient";

export const getVisitReportsApi = async (visitId) => {
  return axiosClient.get(`/visits/${visitId}/reports`);
};

export const generateVisitReportApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/reports/generate`);
};

export const getReportDetailApi = async (reportId) => {
  return axiosClient.get(`/reports/${reportId}`);
};

export const downloadReportApi = async (reportId) => {
  return axiosClient.get(`/reports/${reportId}/download`);
};

export const updateReportVisibilityApi = async (reportId, isVisibleToParent) => {
  return axiosClient.patch(`/reports/${reportId}/visibility`, { isVisibleToParent });
};
