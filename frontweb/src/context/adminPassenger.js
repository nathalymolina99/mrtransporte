import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getPassengersRequest,
  createPassengerRequest,
  updatePassengerRequest,
  deletePassengerRequest,
  updatePassengerStatusRequest,
} from "../config/adminPassenger";

const PassengersContext = createContext();

export const usePassengers = () => {
  return useContext(PassengersContext);
};

export const PassengersProvider = ({ children }) => {
  const [passengers, setPassengers] = useState([]);
  const getPassengers = useCallback(async () => {
    try {
      const response = await getPassengersRequest();
      setPassengers(response.data);
    } catch (error) {
      console.error("Error fetching passengers:", error);
    }
  }, []);

  const createPassenger = useCallback(async (passenger) => {
    try {
      const response = await createPassengerRequest(passenger);
      setPassengers((prevPassengers) => [...prevPassengers, response.data]);
    } catch (error) {
      console.error("Error creating passenger:", error);
    }
  }, []);

  const updatePassenger = useCallback(async (passenger) => {
    try {
      const response = await updatePassengerRequest(passenger);
      setPassengers((prevPassengers) =>
        prevPassengers.map((p) => (p.rut === passenger.rut ? response.data : p))
      );
    } catch (error) {
      console.error("Error updating passenger:", error);
    }
  }, []);

  const deletePassenger = useCallback(async (rut) => {
    try {
      await deletePassengerRequest(rut);
      setPassengers((prevPassengers) =>
        prevPassengers.filter((p) => p.rut !== rut)
      );
    } catch (error) {
      console.error("Error deleting passenger:", error);
    }
  }, []);

  const updatePassengerStatus = useCallback(async (rut, disponible) => {
    try {
      const response = await updatePassengerStatusRequest({ rut, disponible });
      const updatedPassenger = response.data;
  
      setPassengers((prevPassengers) =>
        prevPassengers.map((passenger) =>
          passenger.rut === updatedPassenger.rut ? { ...passenger, disponible: updatedPassenger.disponible } : passenger
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del pasajero:", error);
      throw error;
    }
  }, []);
  

  return (
    <PassengersContext.Provider
      value={{
        passengers,
        getPassengers,
        createPassenger,
        updatePassenger,
        deletePassenger,
        updatePassengerStatus,
      }}
    >
      {children}
    </PassengersContext.Provider>
  );
};
