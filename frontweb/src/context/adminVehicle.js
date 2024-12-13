import React, { createContext, useContext, useState } from "react";
import {
  getVehiclesRequest,
  createVehicleRequest,
  updateVehicleAvailabilityRequest,
  updateVehicleDriverRequest,
  deleteVehicleRequest,
} from "../config/adminVehicle";

const VehiclesContext = createContext();

export const useVehicles = () => {
  return useContext(VehiclesContext);
};

export const VehiclesProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]); 

  const getVehicles = async () => {
    try {
      const response = await getVehiclesRequest(); 
      setVehicles(response.data || []); 
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const createVehicle = async (vehicle) => {
    try {
      const response = await createVehicleRequest(vehicle);
      setVehicles((prevVehicles) => [...prevVehicles, response.data]); 
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  const updateVehicleAvailability = async (id, available) => {
    try {
      const response = await updateVehicleAvailabilityRequest(id, available);
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === id ? { ...vehicle, disponible: available } : vehicle
        )
      );
      return response.data;
    } catch (error) {
      console.error("Error updating vehicle availability:", error);
      throw error;
    }
  };

  const updateVehicleDriver = async (id, rutConductor) => {
    try {
      const response = await updateVehicleDriverRequest(id, rutConductor);
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === id ? { ...vehicle, rutConductor } : vehicle
        )
      );
      return response.data;
    } catch (error) {
      console.error("Error updating vehicle driver:", error);
      throw error;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await deleteVehicleRequest(id);
      setVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle._id !== id)
      );
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        getVehicles,
        createVehicle,
        updateVehicleAvailability,
        updateVehicleDriver,
        deleteVehicle,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
};
