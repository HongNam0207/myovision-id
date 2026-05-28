import axiosClient from "./axiosClient";

export const calculateRiskAssessmentApi = async (visitId) =>
  axiosClient.post(`/visits/${visitId}/risk-assessment/calculate`);

export const getRiskAssessmentApi = async (visitId) =>
  axiosClient.get(`/visits/${visitId}/risk-assessment`);

export const updateRiskAssessmentApi = async (riskAssessmentId, payload) =>
  axiosClient.put(`/risk-assessments/${riskAssessmentId}`, payload);

export const getRiskFactorsApi = async (riskAssessmentId) =>
  axiosClient.get(`/risk-assessments/${riskAssessmentId}/factors`);

export const getRiskHistoryApi = async (patientId) =>
  axiosClient.get(`/patients/${patientId}/risk-history`);

export const riskApi = {
  calculate: calculateRiskAssessmentApi,
  getByVisitId: getRiskAssessmentApi,
  update: updateRiskAssessmentApi,
  getFactors: getRiskFactorsApi,
  getHistory: getRiskHistoryApi,
};
