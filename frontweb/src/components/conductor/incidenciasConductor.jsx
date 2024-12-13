import React, { useEffect, useState } from "react";
import "../../App.css";
import { useIncidents } from "../../context/incidents";
import { toast } from "react-toastify";

const IncidenciasConductor = () => {
  const {
    incidencias,
    createIncidencia,
    getIncidenciasByUser,
    getPassengersRequest,
    passengers,
  } = useIncidents();

  const [descripcion, setDescripcion] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);
  const [mostrarTodo, setMostrarTodo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getPassengersRequest(), getIncidenciasByUser()]);
        
      } catch (err) {
        
        setError("Error al cargar datos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getPassengersRequest, getIncidenciasByUser]);

  const handleCreateIncidencia = async (e) => {
    e.preventDefault();

    if (!descripcion || !selectedPassenger) {
      toast.warn("Por favor completa todos los campos.");
      return;
    }

    const incidenciaData = {
      descripcion,
      estado: "reportada",
      createdBy: "driver",
      createdByModel: "driver",
      relatedPassenger: selectedPassenger,
    };

    try {
      setLoading(true);
      await createIncidencia(incidenciaData);
      setDescripcion("");
      setSelectedPassenger("");
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
              <th className="user-th">Pasajero</th>
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
                    {incidencia.relatedPassenger
                      ? `${incidencia.relatedPassenger.nombre} ${incidencia.relatedPassenger.apellido}`
                      : "Sin pasajero"}
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
              <strong>Pasajero:</strong>{" "}
              {incidenciaSeleccionada.relatedPassenger
                ? `${incidenciaSeleccionada.relatedPassenger.nombre} ${incidenciaSeleccionada.relatedPassenger.apellido}`
                : "Sin pasajero"}
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
            value={selectedPassenger}
            onChange={(e) => setSelectedPassenger(e.target.value)}
            required
          >
            <option value="">Seleccionar pasajero</option>
            {passengers.map((passenger) => (
              <option key={passenger._id} value={passenger._id}>
                {passenger.nombre} {passenger.apellido}
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

export default IncidenciasConductor;
