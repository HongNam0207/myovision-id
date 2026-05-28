import axiosClient from "./axiosClient";

export const getVisitsApi = async () => axiosClient.get("/visits");
export const getVisitDetailApi = async (id) => axiosClient.get(`/visits/${id}/full-record`);

export const visitApi = {
  getAll: getVisitsApi,
  getById: getVisitDetailApi,
};
