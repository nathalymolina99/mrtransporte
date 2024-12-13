import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getDriversRequest,
  createDriverRequest,
  updateDriverRequest,
  deleteDriverRequest,
  updateDriverStatusRequest,
} from "../config/adminDriver";

const DriversContext = createContext();

export const useDrivers = () => {
  return useContext(DriversContext);
};

export const DriversProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);

  const getDrivers = useCallback(async () => {
    try {
      const response = await getDriversRequest();
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  }, []);

  const createDriver = useCallback(async (driver) => {
    try {
      const response = await createDriverRequest(driver);
      setDrivers((prevDrivers) => [...prevDrivers, response.data]); 
    } catch (error) {
      console.error("Error creating driver:", error);
    }
  }, []);

  const updateDriver = useCallback(async (driverData) => {
    try {
      console.group("Actualizando Conductor");
      console.log("Datos a actualizar:", driverData);

      const response = await updateDriverRequest(driverData);

      console.log("Respuesta de actualización:", response.data);

      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver._id === driverData._id || driver.rut === driverData.rut
            ? { ...driver, ...response.data }
            : driver
        )
      );

      console.log("Conductores actualizados");
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
      throw error;
    }
  }, []);

  const deleteDriver = useCallback(async (rut) => {
    try {
      await deleteDriverRequest(rut);
      setDrivers((prevDrivers) => prevDrivers.filter((d) => d.rut !== rut));
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  }, []);

  const updateDriverStatus = useCallback(async (rut, disponible) => {
    try {
      const response = await updateDriverStatusRequest({ rut, disponible });
      const updatedDriver = response.data;

      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.rut === updatedDriver.rut ? { ...driver, disponible: updatedDriver.disponible } : driver
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del conductor:", error);
      throw error;
    }
  }, []);


  return (
    <DriversContext.Provider
      value={{
        drivers,
        getDrivers,
        createDriver,
        updateDriver,
        deleteDriver,
        updateDriverStatus,
      }}
    >
      {children}
    </DriversContext.Provider>
  );
};
