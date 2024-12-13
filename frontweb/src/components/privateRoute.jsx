import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { useContext } from 'react';

const PrivateRoute = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  const userRole = auth.modelo ? auth.modelo.toLowerCase() : null;
  const roleMapping = {
    'admin': 'admin',
    'driver': 'conductor',
    'passenger': 'pasajero'
  };

  const normalizedUserRole = roleMapping[userRole] || userRole;

  if (allowedRoles && (!normalizedUserRole || !allowedRoles.includes(normalizedUserRole))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;