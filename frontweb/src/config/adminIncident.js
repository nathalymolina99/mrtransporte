import axios from "./axios";

export const updateIncidenciaRequest = async (id, estado) => {
  return axios.put(`/admin/incidencias/${id}`, { estado });
};

export const deleteIncidenciaRequest = async (id) => {
  return axios.delete(`/admin/incidencias/${id}`);
};

export const getIncidenciasRequest = async (query) => {
  return axios.get(`/admin/incidencias`, { params: query });
};
