import React, { useEffect, useState } from "react";
import { useAssignments } from "../../context/adminAssignment";
import { useDrivers } from "../../context/adminDriver";
import { usePassengers } from "../../context/adminPassenger";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

export function AssignmentsPage() {
  const { assignments, getAssignments, createAssignment, updateAssignment, deleteAssignment } = useAssignments();
  const { drivers, getDrivers } = useDrivers();
  const { passengers, getPassengers } = usePassengers();

  const [newAssignment, setNewAssignment] = useState({
    rutConductor: "",
    rutsPasajeros: ["", "", "", ""],
  });

  const [editAssignmentData, setEditAssignmentData] = useState(null);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState("");

  useEffect(() => {
    getAssignments();
    getDrivers();
    getPassengers();
  }, [getAssignments, getDrivers, getPassengers]);

  const getFilteredPassengers = (currentIndex, selectedPassengers) => {
    return passengers.filter(
      (passenger) => !selectedPassengers.includes(passenger.rut) || selectedPassengers[currentIndex] === passenger.rut
    );
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    const selectedPassengers = newAssignment.rutsPasajeros.filter((rut) => rut);
    if (!newAssignment.rutConductor || selectedPassengers.length === 0 || selectedPassengers.length > 4) {
      toast.warn("Selecciona un conductor y entre 1 y 4 pasajeros.");
      return;
    }

    try {
      await createAssignment({
        conductor: newAssignment.rutConductor,
        rutsPasajeros: selectedPassengers,
      });
      await getAssignments();
      setNewAssignment({ rutConductor: "", rutsPasajeros: ["", "", "", ""] });
      toast.success("Asignación creada correctamente.");
    } catch (error) {
      console.error("Error al crear la asignación:", error.response?.data || error.message);
      toast.error("Error al crear la asignación. Inténtalo nuevamente.");
    }
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    if (!editAssignmentData) {
      toast.warn("Selecciona una asignación para actualizar.");
      return;
    }
    const selectedPassengers = editAssignmentData.rutsPasajeros.filter((rut) => rut);
    if (!editAssignmentData.rutConductor || selectedPassengers.length === 0 || selectedPassengers.length > 4) {
      toast.warn("Selecciona un conductor y entre 1 y 4 pasajeros.");
      return;
    }

    try {
      await updateAssignment(editAssignmentData._id, { ...editAssignmentData, rutsPasajeros: selectedPassengers });
      await getAssignments();
      setEditAssignmentData(null);
      toast.success("Asignación actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la asignación:", error);
      toast.error("Error al actualizar la asignación. Inténtalo nuevamente.");
    }
  };

  const handleDeleteAssignment = (id) => {
    if (!id) {
      toast.warn("Selecciona una asignación para eliminar.");
      return;
    }

    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar esta asignación?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              await deleteAssignment(id);
              await getAssignments();
              setDeleteAssignmentId("");
              toast.success("Asignación eliminada correctamente.");
            } catch (error) {
              console.error("Error al eliminar la asignación:", error);
              toast.error("Error al eliminar la asignación. Inténtalo nuevamente.");
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

  return (
    <div className="user-container">
      <div className="user-section">
        <h2 className="user-title">ASIGNACIONES REGISTRADAS</h2>
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">ID</th>
                <th className="user-th">CONDUCTOR</th>
                <th className="user-th">PASAJEROS</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td className="user-td">{assignment.idAssignment}</td>
                  <td className="user-td">{assignment.rutConductor}</td>
                  <td className="user-td">{assignment.rutsPasajeros.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="user-section">
        <h2 className="user-title">AGREGAR ASIGNACIÓN</h2>
        <form onSubmit={handleAddAssignment} className="user-form">
          <select
            value={newAssignment.rutConductor}
            onChange={(e) => setNewAssignment({ ...newAssignment, rutConductor: e.target.value })}
            className="user-select"
            required
          >
            <option value="">Seleccionar Conductor</option>
            {drivers.map((driver) => (
              <option key={driver.rut} value={driver.rut}>
                {driver.nombre} {driver.apellido} ({driver.rut})
              </option>
            ))}
          </select>
          {newAssignment.rutsPasajeros.map((_, index) => (
            <select
              key={index}
              value={newAssignment.rutsPasajeros[index] || ""}
              onChange={(e) => {
                const updatedPassengers = [...newAssignment.rutsPasajeros];
                updatedPassengers[index] = e.target.value;
                setNewAssignment({ ...newAssignment, rutsPasajeros: updatedPassengers });
              }}
              className="user-select"
            >
              <option value="">Seleccionar Pasajero {index + 1}</option>
              {getFilteredPassengers(index, newAssignment.rutsPasajeros).map((passenger) => (
                <option key={passenger.rut} value={passenger.rut}>
                  {passenger.nombre} {passenger.apellido} ({passenger.rut})
                </option>
              ))}
            </select>
          ))}
          <button type="submit" className="user-button">
            Agregar Asignación
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ACTUALIZAR ASIGNACIÓN</h2>
        <form onSubmit={handleUpdateAssignment} className="user-form">
          <select
            value={editAssignmentData?._id || ""}
            onChange={(e) => {
              const selectedAssignment = assignments.find((assignment) => assignment._id === e.target.value);
              const passengersWithDefaults = [...(selectedAssignment?.rutsPasajeros || []), "", "", "", ""].slice(0, 4);
              setEditAssignmentData({
                ...selectedAssignment,
                rutsPasajeros: passengersWithDefaults,
              });
            }}
            className="user-select"
            required
          >
            <option value="">Seleccionar Asignación</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.rutConductor} ({assignment.rutsPasajeros.join(", ")})
              </option>
            ))}
          </select>
          {editAssignmentData && (
            <>
              <select
                value={editAssignmentData.rutConductor || ""}
                onChange={(e) => setEditAssignmentData({ ...editAssignmentData, rutConductor: e.target.value })}
                className="user-select"
                required
              >
                <option value="">Seleccionar Conductor</option>
                {drivers.map((driver) => (
                  <option key={driver.rut} value={driver.rut}>
                    {driver.nombre} {driver.apellido} ({driver.rut})
                  </option>
                ))}
              </select>
              {editAssignmentData.rutsPasajeros.map((_, index) => (
                <select
                  key={index}
                  value={editAssignmentData.rutsPasajeros[index] || ""}
                  onChange={(e) => {
                    const updatedPassengers = [...editAssignmentData.rutsPasajeros];
                    updatedPassengers[index] = e.target.value;
                    setEditAssignmentData({ ...editAssignmentData, rutsPasajeros: updatedPassengers });
                  }}
                  className="user-select"
                >
                  <option value="">Seleccionar Pasajero {index + 1}</option>
                  {getFilteredPassengers(index, editAssignmentData.rutsPasajeros).map((passenger) => (
                    <option key={passenger.rut} value={passenger.rut}>
                      {passenger.nombre} {passenger.apellido} ({passenger.rut})
                    </option>
                  ))}
                </select>
              ))}
            </>
          )}
          <button type="submit" className="user-button">
            Actualizar Asignación
          </button>
        </form>
      </div>

      <div className="user-section">
        <h2 className="user-title">ELIMINAR ASIGNACIÓN</h2>
        <form onSubmit={(e) => e.preventDefault()} className="user-form">
          <select
            value={deleteAssignmentId}
            onChange={(e) => setDeleteAssignmentId(e.target.value)}
            className="user-select"
            required
          >
            <option value="">Seleccionar Asignación</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.rutConductor} ({assignment.rutsPasajeros.join(", ")})
              </option>
            ))}
          </select>
          <button
            onClick={() => handleDeleteAssignment(deleteAssignmentId)}
            className="user-button"
          >
            Eliminar Asignación
          </button>
        </form>
      </div>
    </div>
  );
}
