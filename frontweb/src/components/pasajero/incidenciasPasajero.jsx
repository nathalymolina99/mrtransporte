import React, { useEffect, useState } from "react";
import "../../App.css";
import { useIncidents } from "../../context/incidents";
import { toast } from "react-toastify";

const IncidenciasPasajero = () => {
  const {
    incidencias,
    createIncidencia,
    getIncidenciasByUser,
    getDriversRequest,
    drivers,
  } = useIncidents();

  const [descripcion, setDescripcion] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);
  const [mostrarTodo, setMostrarTodo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getDriversRequest(), getIncidenciasByUser()]);
        
      } catch (err) {
        
        setError("Error al cargar datos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getDriversRequest, getIncidenciasByUser]);

  const handleCreateIncidencia = async (e) => {
    e.preventDefault();

    if (!descripcion || !selectedDriver) {
      toast.warn("Por favor completa todos los campos.");
      return;
    }

    const incidenciaData = {
      descripcion,
      estado: "reportada",
      createdBy: "passenger",
      createdByModel: "passenger",
      relatedDriver: selectedDriver,
    };

    try {
      setLoading(true);
      await createIncidencia(incidenciaData);
      setDescripcion("");
      setSelectedDriver("");
      await getIncidenciasByUser();
      toast.success("Incidencia reportada correctamente.");
    } catch (err) {
      toast.error("Error al crear la incidencia.");
      setError("Error al crear la incidencia.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="user-container">
      <section className="user-section">
        <h2 className="user-title">Mis Incidencias</h2>
        {loading && <p>Cargando datos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table className="user-table">
          <thead>
            <tr>
              <th className="user-th">Estado</th>
              <th className="user-th">Conductor</th>
              <th className="user-th">Fecha</th>
              <th className="user-th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(mostrarTodo ? incidencias : incidencias.slice(0, 4)).map(
              (incidencia) => (
                <tr key={incidencia._id}>
                  <td className="user-td">{incidencia.estado}</td>
                  <td className="user-td">
                    {incidencia.relatedDriver
                      ? `${incidencia.relatedDriver.nombre} ${incidencia.relatedDriver.apellido}`
                      : "Sin conductor"}
                  </td>
                  <td className="user-td">{formatDate(incidencia.createdAt)}</td>
                  <td className="user-td">
                    <button
                      className="user-button"
                      onClick={() => setIncidenciaSeleccionada(incidencia)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {incidencias.length > 4 && (
          <button
            className="user-button"
            onClick={() => setMostrarTodo((prev) => !prev)}
          >
            {mostrarTodo ? "Ver Menos" : "Ver Más"}
          </button>
        )}
      </section>

      {incidenciaSeleccionada && (
        <div className="profile-container">
          <button
            className="close-button"
            onClick={() => setIncidenciaSeleccionada(null)}
          >
            ×
          </button>
          <div className="profile-content">
            <h3>Detalles de la Incidencia</h3>
            <p>
              <strong>Descripción:</strong> {incidenciaSeleccionada.descripcion}
            </p>
            <p>
              <strong>Estado:</strong> {incidenciaSeleccionada.estado}
            </p>
            <p>
              <strong>Conductor:</strong>{" "}
              {incidenciaSeleccionada.relatedDriver
                ? `${incidenciaSeleccionada.relatedDriver.nombre} ${incidenciaSeleccionada.relatedDriver.apellido}`
                : "Sin conductor"}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {formatDate(incidenciaSeleccionada.createdAt)}
            </p>
          </div>
        </div>
      )}

      <section className="user-section">
        <h2 className="user-title">Reportar Nueva Incidencia</h2>
        <form className="user-form" onSubmit={handleCreateIncidencia}>
          <select
            className="user-select"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            required
          >
            <option value="">Seleccionar conductor</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.nombre} {driver.apellido}
              </option>
            ))}
          </select>

          <textarea
            className="user-input"
            placeholder="Descripción de la incidencia"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>

          <button className="user-button" type="submit" disabled={loading}>
            {loading ? "Reportando..." : "Reportar Incidencia"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default IncidenciasPasajero;
