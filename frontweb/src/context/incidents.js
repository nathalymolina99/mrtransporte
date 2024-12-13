import React, { createContext, useContext, useState, useCallback } from "react";
import {
  createIncidenciaRequest,
  getIncidenciasByUserRequest,
  getDriversRequest as getDriversRequestFromConfig,
  getPassengersRequest as getPassengersRequestFromConfig,
} from "../config/incidents";

const IncidentsContext = createContext();

export const useIncidents = () => useContext(IncidentsContext);

export const IncidentsProvider = ({ children }) => {
  const [incidencias, setIncidencias] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [passengers,setPassengers]=useState([]);

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
      const response = await getIncidenciasByUserRequest();
      setIncidencias(response.data);
    } catch (error) {
      console.error("Error al obtener las incidencias:", error.message);
    }
  }, []);

  const getDriversRequest = useCallback(async () => {
    try {
      const response = await getDriversRequestFromConfig();
      setDrivers(response);
    } catch (error) {
      console.error("Error al obtener los conductores:", error.message);
    }
  }, []);

  const getPassengersRequest = useCallback(async () => {
    try {
      const response = await getPassengersRequestFromConfig();
      setPassengers(response);
    } catch (error) {
      console.error("Error al obtener los pasajeros:", error.message);
    }
  }, []);

  return (
    <IncidentsContext.Provider
      value={{ incidencias, createIncidencia, getIncidenciasByUser, getDriversRequest,drivers,getPassengersRequest,passengers }}
    >
      {children}
    </IncidentsContext.Provider>
  );
};
