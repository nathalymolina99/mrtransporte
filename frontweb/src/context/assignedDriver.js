import React, { createContext, useContext, useState } from 'react';
import { getAssignedDriverRequest } from '../config/assignedDriver';

const AssignedDriverContext = createContext();

export const useAssignedDriver = () => useContext(AssignedDriverContext);

export const AssignedDriverProvider = ({ children }) => {
  const [assignedDriver, setAssignedDriver] = useState(null); 
  const getAssignedDriver = async () => {
    try {
      const response = await getAssignedDriverRequest();
      console.log('Datos obtenidos del backend:', response.data); 
      setAssignedDriver(response.data); 
    } catch (error) {
      console.error('Error fetching assigned driver:', error);
    }
  };

  return (
    <AssignedDriverContext.Provider value={{ assignedDriver, getAssignedDriver }}>
      {children}
    </AssignedDriverContext.Provider>
  );
};
