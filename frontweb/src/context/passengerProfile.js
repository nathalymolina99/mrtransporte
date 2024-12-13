import React, { createContext, useContext, useState } from 'react';
import { getProfileRequest, updateProfileRequest, changePasswordRequest } from '../config/passengerProfile';

const PassengerProfileContext = createContext();

export const usePassengerProfile = () => useContext(PassengerProfileContext);

export const PassengerProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const getProfile = async () => {
    try {
      const response = await getProfileRequest();
      setProfile(response.data);
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
      alert('Contraseña actualizada con éxito');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error al actualizar la contraseña');
    }
  };

  return (
    <PassengerProfileContext.Provider value={{ profile, getProfile, updateProfile, changePassword }}>
      {children}
    </PassengerProfileContext.Provider>
  );
};
