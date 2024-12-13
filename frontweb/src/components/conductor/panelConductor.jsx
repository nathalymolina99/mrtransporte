import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import Logo from '../logo'; 
import {DriverProfilePage} from './driverProfile'; 
import DriverRoutePage from './driverRoute';
import IncidenciasConductor from './incidenciasConductor'; 
import { DriverProfileProvider } from '../../context/driverProfile';
import { DriverRouteProvider } from '../../context/driverRoute';
import { IncidentsProvider } from '../../context/incidents';

const ControlPanelDriver = () => {
  const { setAuth } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Perfil');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navItems = ['Perfil', 'Rutas', 'Incidencias'];

  const handleLogout = () => {
    setAuth(null); 
    localStorage.removeItem('auth'); 
    navigate('/'); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Perfil':
        return <DriverProfilePage />;
      case 'Rutas':
        return <DriverRoutePage />;
      case 'Incidencias':
        return <IncidenciasConductor />;
      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  return (
    <DriverProfileProvider>
      <DriverRouteProvider>
        <IncidentsProvider>
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
                  <h1>Panel del Conductor</h1>
                </div>
                {renderContent()}
              </div>
            </div>
          </div>
        </IncidentsProvider>
      </DriverRouteProvider>
    </DriverProfileProvider>
  );
};

export default ControlPanelDriver;
