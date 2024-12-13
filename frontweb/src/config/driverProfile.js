import axios from './axios'; 

export const getProfileRequest = async () => {
  try {
    const response = await axios.get('/driver/perfil');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el perfil:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProfileRequest = async (profileData) => {
  try {
    const response = await axios.put('/driver/perfil', profileData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    throw error;
  }
};

export const changePasswordRequest = async (passwordData) => {
  try {
    const response = await axios.put('/driver/contrasena', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error;
  }
};
