import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import Logo from '../logo'; 
import PassengerProfilePage from './passengerProfile'; 
import AssignedDriverPage from './assignedDriver'; 
import IncidenciasPasajero from './incidenciasPasajero'; 

import { PassengerProfileProvider } from '../../context/passengerProfile';
import { AssignedDriverProvider } from '../../context/assignedDriver';
import { IncidentsProvider } from '../../context/incidents';

const ControlPanelPassenger = () => {
  const { setAuth } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Perfil');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = ['Perfil', 'Conductor Asignado', 'Incidencias'];

  const handleLogout = () => {
    setAuth(null); 
    localStorage.removeItem('auth'); 
    navigate('/'); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Perfil':
        return <PassengerProfilePage />;
      case 'Conductor Asignado':
        return <AssignedDriverPage />;
      case 'Incidencias':
        return <IncidenciasPasajero />;
      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  return (
    <PassengerProfileProvider>
      <AssignedDriverProvider>
        <IncidentsProvider>
          <div>
            <Logo />
            <div className="control-panel-container">
             
              <button
                className="menu-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
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
                  <h1>Panel del Pasajero</h1>
                </div>
                {renderContent()}
              </div>
            </div>
          </div>
        </IncidentsProvider>
      </AssignedDriverProvider>
    </PassengerProfileProvider>
  );
};

export default ControlPanelPassenger;
