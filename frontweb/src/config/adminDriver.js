
import axios from "./axios";

export const getDriversRequest = async () => axios.get("/admin/drivers");

export const createDriverRequest = async (driver) => axios.post("/admin/drivers", driver);

export const updateDriverRequest = async (driver) =>
  axios.put(`/admin/drivers/${driver.rut}`, driver);

export const deleteDriverRequest = async (rut) => axios.delete(`/admin/drivers/${rut}`);

export const updateDriverStatusRequest = async (driver) =>
  axios.patch(`/admin/drivers/${driver.rut}`, driver);