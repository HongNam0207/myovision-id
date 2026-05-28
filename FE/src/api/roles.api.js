import axiosClient from "./axiosClient";

export const getRolesApi = async () => axiosClient.get("/roles");
export const getRoleApi = async (roleId) => axiosClient.get(`/roles/${roleId}`);
export const getPermissionsApi = async () => axiosClient.get("/permissions");

export const roleApi = {
  getAll: getRolesApi,
  getById: getRoleApi,
  getPermissions: getPermissionsApi,
};
