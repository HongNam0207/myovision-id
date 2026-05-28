import axiosClient from "./axiosClient";

export const getVisitReportsApi = async (visitId) =>
  axiosClient.get(`/visits/${visitId}/reports`);

export const generateReportApi = async (visitId) =>
  axiosClient.post(`/visits/${visitId}/reports/generate`);

export const getReportApi = async (reportId) =>
  axiosClient.get(`/reports/${reportId}`);

export const reportApi = {
  getByVisitId: getVisitReportsApi,
  generate: generateReportApi,
  getById: getReportApi,
};
