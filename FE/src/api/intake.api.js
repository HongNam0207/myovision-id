import axiosClient from "./axiosClient";

export const intakeApi = {
  getByVisitId: (visitId) =>
    axiosClient.get(`/visits/${visitId}/clinical-intake`),

  create: (visitId, data) =>
    axiosClient.post(`/visits/${visitId}/clinical-intake`, data),

  update: (intakeId, data) =>
    axiosClient.put(`/clinical-intakes/${intakeId}`, data),
};
