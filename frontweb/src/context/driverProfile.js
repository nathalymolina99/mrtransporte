import React, { createContext, useContext, useState } from 'react';
import { getProfileRequest, updateProfileRequest, changePasswordRequest } from '../config/driverProfile';

const DriverProfileContext = createContext();

export const useDriverProfile = () => useContext(DriverProfileContext);

export const DriverProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const getProfile = async () => {
  try {
    const response = await getProfileRequest();
    console.log('Respuesta del perfil del servidor:', response);
    setProfile(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

  const updateProfile = async (profileData) => {
    try {
      const response = await updateProfileRequest(profileData);
      setProfile(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await changePasswordRequest(passwordData);
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to update password');
    }
  };

  return (
    <DriverProfileContext.Provider value={{ profile, getProfile, updateProfile, changePassword }}>
      {children}
    </DriverProfileContext.Provider>
  );
};
