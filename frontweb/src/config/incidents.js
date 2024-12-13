import axios from "./axios"; 

export const createIncidenciaRequest = async (data) => {
  return await axios.post("/incidents", data); 
};

export const getIncidenciasByUserRequest = async () => {
  return await axios.get("/incidents/user"); 
};

export const getDriversRequest = async () => {
  try {
    const response = await axios.get("/passenger/drivers"); 
    return response.data; 
  } catch (error) {
    console.error("Error al obtener los conductores:", error.response?.data || error.message);
    throw error; 
  }
};

export const getPassengersRequest = async () => {
  try {
    const response = await axios.get("/driver/passengers"); 
    return response.data; 
  } catch (error) {
    console.error("Error al obtener los pasajeros:", error.response?.data || error.message);
    throw error; 
  }
};
