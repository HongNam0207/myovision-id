import axiosClient from "./axiosClient";

export const getVisitsApi = async () => {
  return axiosClient.get("/visits");
};

export const getVisitDetailApi = async (id) => {
  return axiosClient.get(`/visits/${id}/full-record`);
};
