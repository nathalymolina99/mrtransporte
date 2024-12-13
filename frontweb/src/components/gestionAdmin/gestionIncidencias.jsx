import React, { useEffect, useState } from "react";
import { useIncidencias } from "../../context/adminIncident";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

export function IncidenciasPage() {
  const {
    incidencias,
    currentPage,
    getIncidencias,
    updateIncidencia,
    deleteIncidencia,
  } = useIncidencias();

  const [filters] = useState({ estado: "", createdBy: "" });
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
  const [newEstado, setNewEstado] = useState("");
  const [deleteIncidenciaId, setDeleteIncidenciaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const descripcionMap = {
    retraso: "Retraso",
    autoProblema: "Problemas con el vehículo",
    comportamiento: "Comportamiento inadecuado",
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    getIncidencias({ ...filters, page: currentPage })
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Error al obtener incidencias:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [filters, currentPage]);

  const handleUpdateEstado = async (e) => {
    e.preventDefault();
    if (!selectedIncidencia || !newEstado) {
      toast.warn("Debes seleccionar una incidencia y un estado válido.");
      return;
    }

    try {
      await updateIncidencia(selectedIncidencia, { estado: newEstado });
      await getIncidencias({ ...filters, page: currentPage });
      setSelectedIncidencia(null);
      setNewEstado("");
      toast.success("Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("Error al actualizar el estado. Inténtalo nuevamente.");
    }
  };

  const handleDeleteIncidencia = (id) => {
    if (!id) {
      toast.warn("Debes seleccionar una incidencia para eliminar.");
      return;
    }

    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar esta incidencia?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await deleteIncidencia(id);
              await getIncidencias({ ...filters, page: currentPage });
              setDeleteIncidenciaId("");
              toast.success("Incidencia eliminada correctamente.");
            } catch (error) {
              console.error("Error al eliminar la incidencia:", error);
              toast.error("Error al eliminar la incidencia. Inténtalo nuevamente.");
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Eliminación cancelada."),
        },
      ],
    });
  };

  if (loading) return <p>Cargando incidencias...</p>;
  if (error) return <p>Error al cargar incidencias: {error}</p>;

  return (
    <div className="user-container">
      <div className="user-section">
        <h2 className="user-title">INCIDENCIAS REGISTRADAS</h2>
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">Descripción</th>
                <th className="user-th">Estado</th>
                <th className="user-th">Creador</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map((incidencia) => (
                <tr key={incidencia._id}>
                  <td className="user-td">{incidencia.descripcion}</td>
                  <td className="user-td">{incidencia.estado}</td>
                  <td className="user-td">
                    {incidencia.createdBy
                      ? `${incidencia.createdBy.nombre} ${incidencia.createdBy.apellido}`
                      : "Desconocido"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="user-section">
        <h2 className="user-title">ACTUALIZAR ESTADO DE INCIDENCIA</h2>
        <form onSubmit={handleUpdateEstado} className="user-form">
          <select
            value={selectedIncidencia || ""}
            onChange={(e) => setSelectedIncidencia(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccionar Incidencia</option>
            {Array.isArray(incidencias) &&
              incidencias.map((incidencia) => (
                <option key={`update-${incidencia._id}`} value={incidencia._id}>
                  {descripcionMap[incidencia.descripcion] || incidencia.descripcion}
                </option>
              ))}
          </select>
          <select
            value={newEstado}
            onChange={(e) => setNewEstado(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccionar Nuevo Estado</option>
            <option value="reportada">Reportada</option>
            <option value="en proceso">En Proceso</option>
            <option value="resuelta">Resuelta</option>
          </select>
          <button type="submit" className="user-button">
            Actualizar Estado
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ELIMINAR INCIDENCIA</h2>
        <form onSubmit={(e) => e.preventDefault()} className="user-form">
          <select
            value={deleteIncidenciaId || ""}
            onChange={(e) => setDeleteIncidenciaId(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccionar Incidencia</option>
            {Array.isArray(incidencias) &&
              incidencias.map((incidencia) => (
                <option key={`delete-${incidencia._id}`} value={incidencia._id}>
                  {descripcionMap[incidencia.descripcion] || incidencia.descripcion}
                </option>
              ))}
          </select>
          <button
            onClick={() => handleDeleteIncidencia(deleteIncidenciaId)}
            className="user-button"
          >
            Eliminar Incidencia
          </button>
        </form>
      </div>
    </div>
  );
}
