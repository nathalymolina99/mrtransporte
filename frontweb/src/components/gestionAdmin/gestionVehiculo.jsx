import React, { useEffect, useState } from "react";
import { useVehicles } from "../../context/adminVehicle";
import { useDrivers } from "../../context/adminDriver";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

export function VehiclesPage() {
  const {
    vehicles,
    getVehicles,
    createVehicle,
    updateVehicleDriver,
    deleteVehicle,
    updateVehicleAvailability,
  } = useVehicles();

  const { drivers, getDrivers } = useDrivers();

  const [newVehicle, setNewVehicle] = useState({
    rutConductor: "",
    marca: "",
    modelo: "",
    color: "",
    patente: "",
    disponible: true,
  });

  const [updateVehicleData, setUpdateVehicleData] = useState({
    _id: "",
    rutConductor: "",
  });

  const [deleteVehicleId, setDeleteVehicleId] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    getVehicles();
    getDrivers();
  }, [getVehicles, getDrivers]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await createVehicle(newVehicle);
      await getVehicles();
      setNewVehicle({
        rutConductor: "",
        marca: "",
        modelo: "",
        color: "",
        patente: "",
        disponible: true,
      });
      toast.success("Vehículo agregado correctamente.");
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
      toast.error("No se pudo agregar el vehículo.");
    }
  };

  const handleUpdateVehicleDriver = async (e) => {
    e.preventDefault();
    if (!updateVehicleData._id || !updateVehicleData.rutConductor) {
      toast.warn("Selecciona un vehículo y un conductor.");
      return;
    }

    try {
      await updateVehicleDriver(updateVehicleData._id, updateVehicleData.rutConductor);
      await getVehicles();
      setUpdateVehicleData({ _id: "", rutConductor: "" });
      toast.success("Conductor actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
      toast.error("No se pudo actualizar el conductor.");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!id) {
      toast.warn("Selecciona un vehículo para eliminar.");
      return;
    }

    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este vehículo?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await deleteVehicle(id);
              await getVehicles();
              setDeleteVehicleId("");
              toast.success("Vehículo eliminado correctamente.");
            } catch (error) {
              console.error("Error al eliminar vehículo:", error);
              toast.error("No se pudo eliminar el vehículo.");
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

  const handleShowMore = () => setVisibleCount(visibleCount + 4);
  const handleShowLess = () => setVisibleCount(4);

  return (
    <div className="user-container">
      <div className="user-section">
        <h2 className="user-title">VEHÍCULOS REGISTRADOS</h2>
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">MARCA</th>
                <th className="user-th">MODELO</th>
                <th className="user-th">COLOR</th>
                <th className="user-th">PATENTE</th>
                <th className="user-th">CONDUCTOR</th>
                <th className="user-th">DISPONIBILIDAD</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.slice(0, visibleCount).map((vehicle) => (
                <tr key={vehicle._id}>
                  <td className="user-td">{vehicle.marca}</td>
                  <td className="user-td">{vehicle.modelo}</td>
                  <td className="user-td">{vehicle.color}</td>
                  <td className="user-td">{vehicle.patente}</td>
                  <td className="user-td">{vehicle.rutConductor}</td>
                  <td className="user-td">
                    {vehicle.disponible ? "Disponible" : "No disponible"}
                    <button
                      onClick={async () => {
                        try {
                          await updateVehicleAvailability(vehicle._id, !vehicle.disponible);
                          await getVehicles();
                          toast.success("Estado del vehículo actualizado.");
                        } catch (error) {
                          console.error("Error al actualizar disponibilidad:", error);
                          toast.error("No se pudo actualizar la disponibilidad.");
                        }
                      }}
                      className="user-button"
                    >
                      {vehicle.disponible ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vehicles.length > visibleCount && (
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
        <h2 className="user-title">AGREGAR VEHÍCULO</h2>
        <form onSubmit={handleAddVehicle} className="user-form">
          <select
            value={newVehicle.rutConductor}
            onChange={(e) => setNewVehicle({ ...newVehicle, rutConductor: e.target.value })}
            className="user-select"
            required
          >
            <option value="">Seleccione un Conductor</option>
            {drivers.map((driver) => (
              <option key={driver.rut} value={driver.rut}>
                {driver.nombre} {driver.apellido} ({driver.rut})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Marca"
            value={newVehicle.marca}
            onChange={(e) => setNewVehicle({ ...newVehicle, marca: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="Modelo"
            value={newVehicle.modelo}
            onChange={(e) => setNewVehicle({ ...newVehicle, modelo: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="Color"
            value={newVehicle.color}
            onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="Patente"
            value={newVehicle.patente}
            onChange={(e) => setNewVehicle({ ...newVehicle, patente: e.target.value })}
            className="user-input"
            required
          />
          <button type="submit" className="user-button">
            Agregar vehículo
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ACTUALIZAR CONDUCTOR</h2>
        <form onSubmit={handleUpdateVehicleDriver} className="user-form">
          <select
            value={updateVehicleData._id}
            onChange={(e) => {
              const selectedVehicle = vehicles.find((v) => v._id === e.target.value);
              setUpdateVehicleData(selectedVehicle || { _id: "", rutConductor: "" });
            }}
            className="user-select"
            required
          >
            <option value="">Seleccione un Vehículo</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.marca} - {vehicle.modelo} ({vehicle.patente})
              </option>
            ))}
          </select>
          <select
            value={updateVehicleData.rutConductor}
            onChange={(e) => setUpdateVehicleData({ ...updateVehicleData, rutConductor: e.target.value })}
            className="user-select"
            required
          >
            <option value="">Seleccione un Conductor</option>
            {drivers.map((driver) => (
              <option key={driver.rut} value={driver.rut}>
                {driver.nombre} {driver.apellido} ({driver.rut})
              </option>
            ))}
          </select>
          <button type="submit" className="user-button">
            Actualizar conductor
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ELIMINAR VEHÍCULO</h2>
        <form onSubmit={(e) => e.preventDefault()} className="user-form">
          <select
            value={deleteVehicleId}
            onChange={(e) => setDeleteVehicleId(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccione un Vehículo</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.marca} - {vehicle.modelo} ({vehicle.patente})
              </option>
            ))}
          </select>
          <button
            onClick={() => handleDeleteVehicle(deleteVehicleId)}
            className="user-button"
          >
            Eliminar vehículo
          </button>
        </form>
      </div>
    </div>
  );
}
