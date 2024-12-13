
import axios from "./axios";

export const getRoutesRequest = async () => axios.get("/admin/routes");

export const createRoutesRequest = async (route) => 
    axios.post("/admin/routes", route);

export const updateRoutesRequest = async (id, route) => {
    console.log('ID de ruta para actualizar:', id);
    console.log('Datos de actualización de ruta:', route);
    return axios.put(`/admin/routes/${id}`, route);
};

export const deleteRoutesRequest = async (id) => 
    axios.delete(`/admin/routes/${id}`);

