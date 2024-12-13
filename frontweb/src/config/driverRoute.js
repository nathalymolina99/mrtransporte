import axios from "./axios";

export const getRouteRequest = async (id) => axios.get(`/driver/ruta/${id}`);
