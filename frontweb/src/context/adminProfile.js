import React, { createContext, useContext } from 'react';
import { changeAdminPassword } from '../config/adminProfile'; 

const AdminPasswordContext = createContext();
export const useAdminPassword = () => useContext(AdminPasswordContext);
export const AdminPasswordProvider = ({ children }) => {
  const changePassword = async (passwordData) => {
    try {
      await changeAdminPassword(passwordData); 
      alert('Contraseña actualizada con éxito');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); 
      } else {
        alert('No se pudo actualizar la contraseña');
      }
    }
  };

  return (
    <AdminPasswordContext.Provider value={{ changePassword }}>
      {children}
    </AdminPasswordContext.Provider>
  );
};
