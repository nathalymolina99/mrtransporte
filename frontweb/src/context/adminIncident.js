import React, { createContext, useContext, useState } from "react";
import {
  updateIncidenciaRequest,
  deleteIncidenciaRequest,
  getIncidenciasRequest,
} from "../config/adminIncident";

const IncidenciasContext = createContext();

export const useIncidencias = () => useContext(IncidenciasContext);

export const IncidenciasProvider = ({ children }) => {
  const [incidencias, setIncidencias] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getIncidencias = async (filters = {}) => {
    try {
      const response = await getIncidenciasRequest(filters);
      setIncidencias(response.data.incidencias);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error al obtener las incidencias:", error.message);
    }
  };

  const updateIncidencia = async (id, estado) => {
    try {
      const response = await updateIncidenciaRequest(id, estado);
      setIncidencias((prev) =>
        prev.map((incidencia) =>
          incidencia._id === id ? response.data : incidencia
        )
      );
    } catch (error) {
      console.error("Error al actualizar la incidencia:", error.message);
    }
  };

  const deleteIncidencia = async (id) => {
    try {
      await deleteIncidenciaRequest(id);
      setIncidencias((prev) => prev.filter((incidencia) => incidencia._id !== id));
    } catch (error) {
      console.error("Error al eliminar la incidencia:", error.message);
    }
  };

  return (
    <IncidenciasContext.Provider
      value={{
        incidencias,
        total,
        currentPage,
        setCurrentPage,
        getIncidencias,
        updateIncidencia,
        deleteIncidencia,
      }}
    >
      {children}
    </IncidenciasContext.Provider>
  );
};