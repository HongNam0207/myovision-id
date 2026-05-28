import axiosClient from "./axiosClient";

export const getAdminOverviewApi = async () =>
  axiosClient.get("/dashboard/admin/overview");

export const getDoctorTodayVisitsApi = async () =>
  axiosClient.get("/dashboard/doctor/today-visits");

export const getNurseWaitingIntakeApi = async () =>
  axiosClient.get("/dashboard/nurse/waiting-intake");

export const getOptometristWaitingMeasurementApi = async () =>
  axiosClient.get("/dashboard/optometrist/waiting-measurement");

export const getParentChildrenSummaryApi = async () =>
  axiosClient.get("/dashboard/parent/children-summary");

export const dashboardApi = {
  adminOverview: getAdminOverviewApi,
  doctorTodayVisits: getDoctorTodayVisitsApi,
  nurseWaitingIntake: getNurseWaitingIntakeApi,
  optometristWaitingMeasurement: getOptometristWaitingMeasurementApi,
  parentChildrenSummary: getParentChildrenSummaryApi,
};
