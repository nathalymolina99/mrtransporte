import React, { createContext, useContext, useState, useCallback } from "react";
import {
  createIncidenciaRequest,
  getIncidenciasByUserRequest,
  getPassengersRequest,
} from "../config/incidents";

const DriverContext = createContext();

export const useDriver = () => useContext(DriverContext);

export const DriverProvider = ({ children }) => {
  const [incidencias, setIncidencias] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);

  const createIncidencia = async (data) => {
    try {
      const response = await createIncidenciaRequest(data);
      setIncidencias((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error al crear la incidencia:", error.message);
    }
  };

  const getIncidenciasByUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getIncidenciasByUserRequest();
      setIncidencias(response.data || []);
    } catch (error) {
      console.error("Error al obtener las incidencias:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPassengers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPassengersRequest();
      console.log("Pasajeros cargados desde el backend:", response.data); 
      setPassengers(response.data || []); 
    } catch (error) {
      console.error("Error al obtener los pasajeros:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DriverContext.Provider
      value={{
        incidencias,
        passengers,
        loading,
        createIncidencia,
        getIncidenciasByUser,
        getPassengers,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};
