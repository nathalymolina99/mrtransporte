import React, { createContext, useContext, useState } from "react";
import axios from "../config/axios";

const RouteContext = createContext();

export const useRoute = () => useContext(RouteContext);

export const DriverRouteProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);

  const getRoutesForDriver = async () => {
    try {
      const response = await axios.get("/driver/rutas"); 
      setRoutes(response.data); 
      return response.data;
    } catch (error) {
      console.error("Error al obtener rutas:", error);
      throw error; 
    }
  };

  return (
    <RouteContext.Provider value={{ routes, getRoutesForDriver }}>
      {children}
    </RouteContext.Provider>
  );
};
