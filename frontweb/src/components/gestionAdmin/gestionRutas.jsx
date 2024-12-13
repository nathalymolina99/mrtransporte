import React, { useEffect, useState } from "react";
import { useRoutes } from "../../context/adminRoute";
import { useAssignments } from "../../context/adminAssignment";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export function RoutesPage() {
  const { routes, getRoutes, createRoute,  deleteRoute } = useRoutes();
  const { assignments, getAssignments } = useAssignments();

  const [newRoute, setNewRoute] = useState({
    fechaRealizacion: "",
    horaComienzo: "",
    horaFinalizacionEstimada: "",
    idAsignacion: "",
  });

  const [deleteRouteId, setDeleteRouteId] = useState("");

  useEffect(() => {
    getRoutes();
    getAssignments();
  }, [getRoutes, getAssignments]);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    const { fechaRealizacion, horaComienzo, horaFinalizacionEstimada, idAsignacion } = newRoute;

    if (!fechaRealizacion || !horaComienzo || !horaFinalizacionEstimada || !idAsignacion) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }

    const formattedFecha = fechaRealizacion;
    const formattedHoraComienzo = dayjs(`${formattedFecha}T${horaComienzo}`).toISOString();
    const formattedHoraFinalizacionEstimada = dayjs(`${formattedFecha}T${horaFinalizacionEstimada}`).toISOString();

    try {
      await createRoute({
        idAsignacion,
        fechaRealizacion: formattedFecha,
        horaComienzo: formattedHoraComienzo,
        horaFinalizacionEstimada: formattedHoraFinalizacionEstimada,
      });
      toast.success("Ruta creada correctamente");
      await getRoutes();
      setNewRoute({
        fechaRealizacion: "",
        horaComienzo: "",
        horaFinalizacionEstimada: "",
        idAsignacion: "",
      });
    } catch (error) {
      console.error("Error al agregar ruta:", error);
      toast.error("Error al agregar ruta. Inténtalo nuevamente.");
    }
  };

  const handleDeleteRoute = (routeId) => {
    if (!routeId) {
      toast.warn("Debes seleccionar una ruta para eliminar");
      return;
    }

    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar esta ruta?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await deleteRoute(routeId);
              await getRoutes();
              setDeleteRouteId("");
              toast.success("Ruta eliminada correctamente");
            } catch (error) {
              console.error("Error al eliminar ruta:", error);
              toast.error("Error al eliminar ruta. Inténtalo nuevamente.");
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Eliminación cancelada"),
        },
      ],
    });
  };

  return (
    <div className="user-container">
      <div className="user-section">
        <h2 className="user-title">RUTAS REGISTRADAS</h2>
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">ID RUTA</th>
                <th className="user-th">FECHA REALIZACIÓN</th>
                <th className="user-th">HORA COMIENZO</th>
                <th className="user-th">HORA FINALIZACIÓN</th>
                <th className="user-th">ID ASIGNACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route._id || route.idRoutes}>
                  <td className="user-td">{route.idRoutes || "Sin ID"}</td>
                  <td className="user-td">{new Date(route.fechaRealizacion).toLocaleDateString()}</td>
                  <td className="user-td">{new Date(route.horaComienzo).toLocaleTimeString()}</td>
                  <td className="user-td">{new Date(route.horaFinalizacionEstimada).toLocaleTimeString()}</td>
                  <td className="user-td">
                    {route.idAsignacion
                      ? typeof route.idAsignacion === "object"
                        ? route.idAsignacion.idAssignment || route.idAsignacion._id || "Sin Asignación"
                        : route.idAsignacion
                      : "Sin Asignación"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="user-section">
        <h2 className="user-title">AGREGAR RUTA</h2>
        <form onSubmit={handleAddRoute} className="user-form">
          <input
            type="date"
            value={newRoute.fechaRealizacion}
            onChange={(e) => setNewRoute({ ...newRoute, fechaRealizacion: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="time"
            value={newRoute.horaComienzo}
            onChange={(e) => setNewRoute({ ...newRoute, horaComienzo: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="time"
            value={newRoute.horaFinalizacionEstimada}
            onChange={(e) => setNewRoute({ ...newRoute, horaFinalizacionEstimada: e.target.value })}
            className="user-input"
            required
          />
          <select
            value={newRoute.idAsignacion}
            onChange={(e) => setNewRoute({ ...newRoute, idAsignacion: e.target.value })}
            className="user-select"
            required
          >
            <option value="">Seleccionar Asignación</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.idAssignment}
              </option>
            ))}
          </select>
          <button type="submit" className="user-button">
            Agregar Ruta
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ELIMINAR RUTA</h2>
        <form onSubmit={(e) => e.preventDefault()} className="user-form">
          <select
            value={deleteRouteId}
            onChange={(e) => setDeleteRouteId(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccionar Ruta</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.idRoutes} - {route.fechaRealizacion}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleDeleteRoute(deleteRouteId)}
            className="user-button"
          >
            Eliminar Ruta
          </button>
        </form>
      </div>
    </div>
  );
}
