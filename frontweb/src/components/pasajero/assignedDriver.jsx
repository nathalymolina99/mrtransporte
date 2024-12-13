import React, { useEffect, useState } from 'react';
import { useAssignedDriver } from '../../context/assignedDriver';

const AssignedDriverPage = () => {
  const { assignedDriver, getAssignedDriver } = useAssignedDriver();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getAssignedDriver(); 
      setLoading(false);
    };
    fetchData();
  }, []);
  


  return (
    <div className="profile-container">
      <h2 className="profile-title">Conductor Asignado</h2>
      <div className="profile-content">
        {loading ? (
          <p>Cargando...</p>
        ) : assignedDriver ? (
          <div className="profile-info">
            <h3>Información del Conductor</h3>
            <p><strong>Nombre:</strong> {assignedDriver.conductor.nombre} {assignedDriver.conductor.apellido}</p>
            <p><strong>Teléfono:</strong> {assignedDriver.conductor.telefono}</p>
            <h3>Información del Vehículo</h3>
            <p><strong>Marca:</strong> {assignedDriver.vehiculo.marca}</p>
            <p><strong>Modelo:</strong> {assignedDriver.vehiculo.modelo}</p>
            <p><strong>Color:</strong> {assignedDriver.vehiculo.color}</p>
            <p><strong>Patente:</strong> {assignedDriver.vehiculo.patente}</p>
          </div>
        ) : (
          <p>No tienes un conductor asignado.</p>
        )}
      </div>
    </div>
  );
};

export default AssignedDriverPage;
