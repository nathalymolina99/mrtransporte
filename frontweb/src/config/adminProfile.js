import axios from "./axios"; 

export const changeAdminPassword = async (passwordData) => {
    try {
      const response = await axios.put('/admin/actualizar-contrasena', passwordData); 
      return response.data;
    } catch (error) {
      console.error('Error al cambiar la contraseña del administrador:', error.response?.data || error.message);
      throw error;
    }
  };