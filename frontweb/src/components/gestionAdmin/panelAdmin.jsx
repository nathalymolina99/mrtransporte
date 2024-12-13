import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import Logo from '../logo'; 
import { RoutesPage } from './gestionRutas'; 
import { DriversPage } from './gestionConductor'; 
import { PassengersPage } from './gestionPasajero'; 
import { IncidenciasPage } from './gestionIncidencias'; 
import { AssignmentsPage } from './gestionAsignaciones'; 
import { VehiclesPage } from './gestionVehiculo'; 
import ChangeAdminPasswordPage from './gestionProfile';

import { DriversProvider } from '../../context/adminDriver';
import { PassengersProvider } from '../../context/adminPassenger';
import { AssignmentsProvider } from '../../context/adminAssignment';
import { RoutesProvider } from '../../context/adminRoute';
import { IncidenciasProvider } from '../../context/adminIncident';
import { VehiclesProvider } from '../../context/adminVehicle';
import {AdminPasswordProvider} from '../../context/adminProfile';


const ControlPanel = () => {
  const { setAuth } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Conductor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = ['Conductor', 'Pasajero', 'Rutas', 'Incidencias', 'Asignación', 'Vehiculo','Cambio de contraseña'];

  const handleLogout = () => {
    setAuth(null); 
    localStorage.removeItem('auth'); 
    navigate('/'); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Conductor':
        return <DriversPage />;
      case 'Pasajero':
        return <PassengersPage />;
      case 'Rutas':
        return <RoutesPage />;
      case 'Incidencias':
        return <IncidenciasPage />;
      case 'Asignación':
        return <AssignmentsPage />;
      case 'Vehiculo':
        return <VehiclesPage />;
      case 'Cambio de contraseña':
        return <ChangeAdminPasswordPage />;
      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  return (
    <DriversProvider>
      <PassengersProvider>
        <AssignmentsProvider>
          <RoutesProvider>
            <IncidenciasProvider>
              <VehiclesProvider>
                <AdminPasswordProvider>
                <div>
                  <Logo />
                  <div className="control-panel-container">
                   
                    <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                      &#9776;
                    </button>

                    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                      {navItems.map((item) => (
                        <div
                          key={item}
                          className={`nav-item ${activeTab === item ? 'active' : ''}`}
                          onClick={() => {
                            setActiveTab(item);
                            setIsSidebarOpen(false); 
                          }}
                        >
                          {item}
                        </div>
                      ))}
                      <button className="close-session" onClick={handleLogout}>
                        Cerrar Sesión
                      </button>
                    </div>

                    <div className="content">
                      <div className="header">
                        <h1>PANEL DE CONTROL</h1>
                      </div>
                      {renderContent()}
                    </div>
                  </div>
                </div>
                </AdminPasswordProvider>
              </VehiclesProvider>
            </IncidenciasProvider>
          </RoutesProvider>
        </AssignmentsProvider>
      </PassengersProvider>
    </DriversProvider>
  );
};

export default ControlPanel;
