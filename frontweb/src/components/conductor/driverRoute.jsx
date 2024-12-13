import React, { useEffect, useState } from "react";
import { useRoute } from "../../context/driverRoute";

const DriverRoutesPage = () => {
  const { getRoutesForDriver, routes } = useRoute(); 
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null); 
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        await getRoutesForDriver(); 
      } catch (err) {
        setError("Error al obtener las rutas. Intenta nuevamente.");
      }
    };

    if (!routes.length) { 
      fetchRoutes();
    }
  }, [getRoutesForDriver, routes]);

  const openGoogleMaps = (direccion) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="user-container">
      <section className="user-section">
        <h2 className="user-title">Mis Rutas</h2>
        {error && <p className="error-message">{error}</p>}
        {routes.length === 0 && !error ? (
          <p>No hay rutas disponibles.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">ID Ruta</th>
                <th className="user-th">Fecha</th>
                <th className="user-th">Inicio</th>
                <th className="user-th">Fin</th>
                <th className="user-th">Pasajeros</th>
                <th className="user-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route._id}>
                  <td className="user-td">{route.idRoutes}</td>
                  <td className="user-td">{new Date(route.fechaRealizacion).toLocaleDateString()}</td>
                  <td className="user-td">{new Date(route.horaComienzo).toLocaleTimeString()}</td>
                  <td className="user-td">{new Date(route.horaFinalizacionEstimada).toLocaleTimeString()}</td>
                  <td className="user-td">
                    {route.pasajeros?.map((pasajero) => pasajero.nombre).join(", ") || "Sin pasajeros"}
                  </td>
                  <td className="user-td">
                    <button
                      className="user-button"
                      onClick={() => setSelectedRoute(route)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedRoute && (
        <section className="profile-container">
          <button
            className="close-button"
            onClick={() => setSelectedRoute(null)}
          >
            ×
          </button>
          <div className="profile-content">
            <h3>Detalles de la Ruta</h3>
            <p>
              <strong>ID Ruta:</strong> {selectedRoute.idRoutes}
            </p>
            <p>
              <strong>Fecha:</strong> {new Date(selectedRoute.fechaRealizacion).toLocaleDateString()}
            </p>
            <p>
              <strong>Inicio:</strong> {new Date(selectedRoute.horaComienzo).toLocaleTimeString()}
            </p>
            <p>
              <strong>Fin:</strong> {new Date(selectedRoute.horaFinalizacionEstimada).toLocaleTimeString()}
            </p>
            <h4>Pasajeros</h4>
            {selectedRoute.pasajeros?.length > 0 ? (
              <ul>
                {selectedRoute.pasajeros.map((pasajero) => (
                  <li key={pasajero._id}>
                    <p><strong>Nombre:</strong> {pasajero.nombre} {pasajero.apellido}</p>
                    <p><strong>Teléfono:</strong> {pasajero.telefono}</p>
                    <p>
                      <strong>Dirección:</strong>{" "}
                      <span
                        className="google-maps-link"
                        onClick={() => openGoogleMaps(pasajero.direccion)}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        {pasajero.direccion}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sin pasajeros</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default DriverRoutesPage;
