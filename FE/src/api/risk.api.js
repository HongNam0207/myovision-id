import axiosClient from "./axiosClient";

export const calculateRiskAssessmentApi = async (visitId) => {
  return axiosClient.post(`/visits/${visitId}/risk-assessment/calculate`);
};

export const getRiskAssessmentApi = async (visitId) => {
  return axiosClient.get(`/visits/${visitId}/risk-assessment`);
};

export const updateRiskAssessmentApi = async (riskAssessmentId, payload) => {
  return axiosClient.put(`/risk-assessments/${riskAssessmentId}`, payload);
};

export const getRiskFactorsApi = async (riskAssessmentId) => {
  return axiosClient.get(`/risk-assessments/${riskAssessmentId}/factors`);
};

export const getRiskHistoryApi = async (patientId) => {
  return axiosClient.get(`/patients/${patientId}/risk-history`);
};
