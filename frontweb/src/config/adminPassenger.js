
import axios from "./axios"; 

export const getPassengersRequest = async () => axios.get("/admin/passengers");

export const createPassengerRequest = async (passenger) => axios.post("/admin/passengers", passenger);

export const updatePassengerRequest = async (passenger) =>
  axios.put(`/admin/passengers/${passenger.rut}`, passenger);

export const deletePassengerRequest = async (rut) => axios.delete(`/admin/passengers/${rut}`);

export const updatePassengerStatusRequest = async (passenger) =>
  axios.patch(`/admin/passengers/${passenger.rut}`, passenger);