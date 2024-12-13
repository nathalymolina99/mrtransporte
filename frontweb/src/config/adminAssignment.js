
import axios from "./axios";

export const getAssignmentsRequest = async () => axios.get("/admin/assignments");

export const createAssignmentRequest = async (assignment) => axios.post("/admin/assignments", assignment);

export const updateAssignmentRequest = async (id, assignment) => {
    console.log('ID para actualizar:', id);
    console.log('Datos de actualización:', assignment);
    return axios.put(`/admin/assignments/${id}`, assignment);
};
  
export const deleteAssignmentRequest = async (id) =>
    axios.delete(`/admin/assignments/${id}`);
export const getAssignmentRequest = async (id) => axios.get(`/admin/assignments/${id}`);