import React, { useEffect, useState } from "react";
import { usePassengers } from "../../context/adminPassenger";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export function PassengersPage() {
  const {
    passengers,
    getPassengers,
    createPassenger,
    updatePassenger,
    deletePassenger,
    updatePassengerStatus,
  } = usePassengers();
  const [newPassenger, setNewPassenger] = useState({ rut: "", nombre: "", apellido: "", telefono: "", direccion: "" });
  const [updatePassengerData, setUpdatePassengerData] = useState({ rut: "", nombre: "", apellido: "", telefono: "", direccion: "" });
  const [deletePassengerRut, setDeletePassengerRut] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    getPassengers();
  }, [getPassengers]);

  const handleAddPassenger = async (e) => {
    e.preventDefault();
    if (!newPassenger.rut || !newPassenger.nombre || !newPassenger.apellido || !newPassenger.telefono || !newPassenger.direccion) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }
    try {
      await createPassenger(newPassenger);
      await getPassengers(); 
      setNewPassenger({ rut: "", nombre: "", apellido: "", telefono: "", direccion: "" });
      toast.success("Pasajero agregado correctamente");
    } catch (error) {
      console.error("Error al agregar pasajero:", error);
      toast.error("Error al agregar pasajero. Inténtalo nuevamente.");
    }
  };

  const handleUpdatePassenger = async (e) => {
    e.preventDefault();
    if (!updatePassengerData.rut) {
      toast.warn("Debes seleccionar un pasajero para actualizar");
      return;
    }
    try {
      await updatePassenger(updatePassengerData);
      await getPassengers(); 
      setUpdatePassengerData({ rut: "", nombre: "", apellido: "", telefono: "", direccion: "" });
      toast.success("Pasajero actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar pasajero:", error);
      toast.error("Error al actualizar pasajero. Inténtalo nuevamente.");
    }
  };

  const handleDeletePassenger = (rut) => {
    if (!rut) {
      toast.warn("Debes seleccionar un pasajero para eliminar");
      return;
    }

    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este pasajero?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await deletePassenger(rut);
              await getPassengers(); 
              toast.success("Pasajero eliminado correctamente");
              setDeletePassengerRut("");
            } catch (error) {
              console.error("Error al eliminar pasajero:", error);
              toast.error("Error al eliminar pasajero. Inténtalo nuevamente.");
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
      await updatePassengerStatus(rut, !currentStatus); 
      toast.info(`Estado del pasajero actualizado a ${!currentStatus ? "Disponible" : "No disponible"}`);
    } catch (error) {
      console.error("Error al cambiar el estado del pasajero:", error);
      toast.error("Error al actualizar el estado del pasajero.");
    }
  };

  const handleShowMore = () => setVisibleCount(visibleCount + 4);
  const handleShowLess = () => setVisibleCount(4);

  return (
    <div className="user-container">
      <div className="user-section">
        <h2 className="user-title">PASAJEROS REGISTRADOS</h2>
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">RUT</th>
                <th className="user-th">NOMBRE</th>
                <th className="user-th">APELLIDO</th>
                <th className="user-th">TELÉFONO</th>
                <th className="user-th">DIRECCIÓN</th>
                <th className="user-th">ESTADO</th>
                <th className="user-th">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {passengers.slice(0, visibleCount).map((passenger) => (
                <tr key={passenger.rut}>
                  <td className="user-td">{passenger.rut}</td>
                  <td className="user-td">{passenger.nombre}</td>
                  <td className="user-td">{passenger.apellido}</td>
                  <td className="user-td">{passenger.telefono}</td>
                  <td className="user-td">{passenger.direccion}</td>
                  <td className="user-td">{passenger.disponible ? "Disponible" : "No disponible"}</td>
                  <td className="user-td">
                    <button
                      onClick={() => handleToggleStatus(passenger.rut, passenger.disponible)}
                      className="user-button"
                    >
                      {passenger.disponible ? "Desactivar" : "Activar"}
                    </button>
                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {passengers.length > visibleCount && (
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
        <h2 className="user-title">AGREGAR PASAJERO</h2>
        <form onSubmit={handleAddPassenger} className="user-form">
          <input
            type="text"
            placeholder="RUT"
            value={newPassenger.rut}
            onChange={(e) => setNewPassenger({ ...newPassenger, rut: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="NOMBRE"
            value={newPassenger.nombre}
            onChange={(e) => setNewPassenger({ ...newPassenger, nombre: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="APELLIDO"
            value={newPassenger.apellido}
            onChange={(e) => setNewPassenger({ ...newPassenger, apellido: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="TELÉFONO"
            value={newPassenger.telefono}
            onChange={(e) => setNewPassenger({ ...newPassenger, telefono: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="DIRECCIÓN"
            value={newPassenger.direccion}
            onChange={(e) => setNewPassenger({ ...newPassenger, direccion: e.target.value })}
            className="user-input"
            required
          />
          <button type="submit" className="user-button">
            Agregar pasajero
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ACTUALIZAR PASAJERO</h2>
        <form onSubmit={handleUpdatePassenger} className="user-form">
          <select
            value={updatePassengerData.rut}
            onChange={(e) => {
              const selectedPassenger = passengers.find((passenger) => passenger.rut === e.target.value);
              setUpdatePassengerData(selectedPassenger || { rut: "", nombre: "", apellido: "", telefono: "", direccion: "" });
            }}
            className="user-select"
            required
          >
            <option value="">Seleccione un RUT</option>
            {passengers.map((passenger) => (
              <option key={passenger.rut} value={passenger.rut}>
                {passenger.rut}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="NOMBRE"
            value={updatePassengerData.nombre}
            onChange={(e) => setUpdatePassengerData({ ...updatePassengerData, nombre: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="APELLIDO"
            value={updatePassengerData.apellido}
            onChange={(e) => setUpdatePassengerData({ ...updatePassengerData, apellido: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="TELÉFONO"
            value={updatePassengerData.telefono}
            onChange={(e) => setUpdatePassengerData({ ...updatePassengerData, telefono: e.target.value })}
            className="user-input"
            required
          />
          <input
            type="text"
            placeholder="DIRECCIÓN"
            value={updatePassengerData.direccion}
            onChange={(e) => setUpdatePassengerData({ ...updatePassengerData, direccion: e.target.value })}
            className="user-input"
            required
          />
          <button type="submit" className="user-button">
            Actualizar pasajero
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ELIMINAR PASAJERO</h2>
        <form onSubmit={(e) => e.preventDefault()} className="user-form">
          <select
            value={deletePassengerRut}
            onChange={(e) => setDeletePassengerRut(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccione un RUT</option>
            {passengers.map((passenger) => (
              <option key={passenger.rut} value={passenger.rut}>
                {passenger.rut}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleDeletePassenger(deletePassengerRut)}
            className="user-button"
          >
            Eliminar pasajero
          </button>
        </form>
      </div>
    </div>
  );
}
