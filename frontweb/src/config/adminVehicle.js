import axios from "./axios"; 

export const getVehiclesRequest = async () => axios.get("/admin/vehicles");

export const createVehicleRequest = async (vehicle) => axios.post("/admin/vehicles", vehicle);

export const updateVehicleAvailabilityRequest = async (id, available) =>
    axios.patch(`/admin/vehicles/${id}/availability`, { disponible: available });

export const updateVehicleDriverRequest = async (id, rutConductor) =>
  axios.patch(`/admin/vehicles/${id}/driver`, { rutConductor });

export const deleteVehicleRequest = async (id) => axios.delete(`/admin/vehicles/${id}`);