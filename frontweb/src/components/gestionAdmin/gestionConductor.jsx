import React, { useEffect, useState } from "react";
import { useDrivers } from "../../context/adminDriver";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

export function DriversPage() {
  const { drivers, getDrivers, createDriver, updateDriver, deleteDriver, updateDriverStatus } = useDrivers();
  const [newDriver, setNewDriver] = useState({ rut: "", nombre: "", apellido: "", telefono: "" });
  const [updateDriverData, setUpdateDriverData] = useState({ rut: "", nombre: "", apellido: "", telefono: "" });
  const [deleteDriverRut, setDeleteDriverRut] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    getDrivers();
  }, [getDrivers]);

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (!newDriver.rut || !newDriver.nombre || !newDriver.apellido || !newDriver.telefono) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }
    try {
      await createDriver(newDriver);
      await getDrivers(); 
      setNewDriver({ rut: "", nombre: "", apellido: "", telefono: "" });
      toast.success("Conductor agregado correctamente");
    } catch (error) {
      console.error("Error al agregar conductor:", error);
      toast.error("Error al agregar conductor. Inténtalo nuevamente.");
    }
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    if (!updateDriverData.rut) {
      toast.warn("Debes seleccionar un conductor para actualizar");
      return;
    }
    try {
      await updateDriver(updateDriverData);
      await getDrivers(); 
      setUpdateDriverData({ rut: "", nombre: "", apellido: "", telefono: "" });
      toast.success("Conductor actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
      toast.error("Error al actualizar conductor. Inténtalo nuevamente.");
    }
  };

  const handleDeleteDriver = async (e) => {
    e.preventDefault();
    if (!deleteDriverRut) {
      toast.warn("Debes seleccionar un conductor para eliminar");
      return;
    }
  
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este conductor?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await deleteDriver(deleteDriverRut);
              await getDrivers(); 
              setDeleteDriverRut("");
              toast.success("Conductor eliminado correctamente");
            } catch (error) {
              console.error("Error al eliminar conductor:", error);
              toast.error("Error al eliminar conductor. Inténtalo nuevamente.");
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
  

  const handleToggleStatus = async (rut, currentStatus) => {
    try {
      await updateDriverStatus(rut, !currentStatus); 
      toast.info(`Estado del conductor actualizado a ${!currentStatus ? "Disponible" : "No disponible"}`);
    } catch (error) {
      console.error("Error al cambiar el estado del conductor:", error);
      toast.error("Error al actualizar el estado del conductor.");
    }
  };

  const handleShowMore = () => setVisibleCount(visibleCount + 4);
  const handleShowLess = () => setVisibleCount(4);

  return (
    <div className="user-container">
      <div className="user-section">
        <h2 className="user-title">CONDUCTORES REGISTRADOS</h2>
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">RUT</th>
                <th className="user-th">Nombre</th>
                <th className="user-th">Apellido</th>
                <th className="user-th">Teléfono</th>
                <th className="user-th">Estado</th>
                <th className="user-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.rut}>
                  <td className="user-td">{driver.rut}</td>
                  <td className="user-td">{driver.nombre}</td>
                  <td className="user-td">{driver.apellido}</td>
                  <td className="user-td">{driver.telefono}</td>
                  <td className="user-td">{driver.disponible ? "Disponible" : "No disponible"}</td>
                  <td className="user-td">
                    <button
                      onClick={() => handleToggleStatus(driver.rut, driver.disponible)}
                      className="user-button"
                    >
                      {driver.disponible ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {drivers.length > visibleCount && (
            <button onClick={handleShowMore} className="user-button">
              Ver más
            </button>
          )}
          {visibleCount > 4 && (
            <button onClick={handleShowLess} className="user-button">
              Ver menos
            </button>
          )}
        </div>
      </div>

      <div className="user-section">
        <h2 className="user-title">AGREGAR CONDUCTORES</h2>
        <form onSubmit={handleAddDriver} className="user-form">
          <input
            type="text"
            placeholder="RUT"
            value={newDriver.rut}
            onChange={(e) => setNewDriver({ ...newDriver, rut: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="NOMBRE"
            value={newDriver.nombre}
            onChange={(e) => setNewDriver({ ...newDriver, nombre: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="APELLIDO"
            value={newDriver.apellido}
            onChange={(e) => setNewDriver({ ...newDriver, apellido: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="TELÉFONO"
            value={newDriver.telefono}
            onChange={(e) => setNewDriver({ ...newDriver, telefono: e.target.value })}
            className="user-input"
            required
          />
          <button type="submit" className="user-button">
            Agregar conductor
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ACTUALIZAR CONDUCTOR</h2>
        <form onSubmit={handleUpdateDriver} className="user-form">
          <select
            value={updateDriverData.rut}
            onChange={(e) => {
              const selectedDriver = drivers.find((driver) => driver.rut === e.target.value);
              setUpdateDriverData(selectedDriver || { rut: "", nombre: "", apellido: "", telefono: "" });
            }}
            className="user-select"
            required
          >
            <option value="">Seleccione un RUT</option>
            {drivers.map((driver) => (
              <option key={driver.rut} value={driver.rut}>
                {driver.rut}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="NOMBRE"
            value={updateDriverData.nombre}
            onChange={(e) => setUpdateDriverData({ ...updateDriverData, nombre: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="APELLIDO"
            value={updateDriverData.apellido}
            onChange={(e) => setUpdateDriverData({ ...updateDriverData, apellido: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="TELÉFONO"
            value={updateDriverData.telefono}
            onChange={(e) => setUpdateDriverData({ ...updateDriverData, telefono: e.target.value })}
            className="user-input"
            required
          />
          <button type="submit" className="user-button">
            Actualizar conductor
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ELIMINAR CONDUCTOR</h2>
        <form onSubmit={handleDeleteDriver} className="user-form">
          <select
            value={deleteDriverRut}
            onChange={(e) => setDeleteDriverRut(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccione un RUT</option>
            {drivers.map((driver) => (
              <option key={driver.rut} value={driver.rut}>
                {driver.rut}
              </option>
            ))}
          </select>
          <button type="submit" className="user-button">
            Eliminar conductor
          </button>
        </form>
      </div>
    </div>
  );
}
