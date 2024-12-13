import React, { createContext, useContext, useState, useCallback } from "react";
import {
  createIncidenciaRequest,
  getIncidenciasByUserRequest,
  getDriversRequest,
} from "../config/incidents";

const PassengerContext = createContext();

export const usePassenger = () => useContext(PassengerContext);

export const PassengerProvider = ({ children }) => {
  const [incidencias, setIncidencias] = useState([]);
  const [drivers, setDrivers] = useState([]);
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


  const getDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDriversRequest();
      setDrivers(response.data || []);
    } catch (error) {
      console.error("Error al obtener los conductores:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PassengerContext.Provider
      value={{
        incidencias,
        drivers,
        loading,
        createIncidencia,
        getIncidenciasByUser,
        getDrivers,
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
};
