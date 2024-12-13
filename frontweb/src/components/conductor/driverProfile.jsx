import React, { useEffect, useState } from 'react';
import { useDriverProfile } from '../../context/driverProfile';
import '../../App.css';
import { toast } from 'react-toastify';

export const DriverProfilePage = () => {
  const { profile, getProfile, updateProfile, changePassword } = useDriverProfile();
  const [editProfile, setEditProfile] = useState({ telefono: '', nombre: '', apellido: '' });
  const [passwordData, setPasswordData] = useState({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
  const [editando, setEditando] = useState(false);
  const [cambiandoContrasena, setCambiandoContrasena] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editProfile);
      setEditando(false);
      toast.success('Perfil actualizado correctamente.');
    } catch (error) {
      toast.error('Error al actualizar el perfil.');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }
    changePassword(passwordData);
    setPasswordData({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
    setCambiandoContrasena(false);
  };

  return (
    <div className='profile-container'>
      <h2 className='profile-title'>Mi Perfil</h2>
      <div className='profile-content'>
        {!editando ? (
          <>
            {profile && (
              <div className='profile-info'>
                <p><strong>Nombre:</strong> {profile.nombre}</p>
                <p><strong>Apellido:</strong> {profile.apellido}</p>
                <p><strong>Teléfono:</strong> {profile.telefono}</p>
              </div>
            )}
            <button className='profile-button edit' onClick={() => setEditando(true)}>Editar Perfil</button>
            <button className='profile-button edit' onClick={() => setCambiandoContrasena(!cambiandoContrasena)}>
              {cambiandoContrasena ? 'Cancelar Cambio de Contraseña' : 'Cambiar Contraseña'}
            </button>
          </>
        ) : (
          <form className='profile-form' onSubmit={handleProfileUpdate}>
            
            <div className='form-group'>
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={editProfile.telefono}
                onChange={(e) => setEditProfile({ ...editProfile, telefono: e.target.value })}
              />
            </div>
            <div className='form-actions'>
              <button className='profile-button save' type="submit">Guardar</button>
              <button className='profile-button cancel' type="button" onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </form>
        )}

        {cambiandoContrasena && (
          <form className="user-form" onSubmit={handleChangePassword}>
            <div className="user-container">
             <div className="user-section">
            <h2 className="user-title">Cambiar Contraseña</h2>
              <input
                type="password"
                placeholder="INGRESE SU CONTRASEÑA ACTUAL"
                value={passwordData.contrasenaActual}
                onChange={(e) => setPasswordData({ ...passwordData, contrasenaActual: e.target.value })}
              className="user-input"
              />
            
            
             
              <input
                type="password"
                placeholder="INGRESE SU CONTRASEÑA NUEVA"
                value={passwordData.nuevaContrasena}
                onChange={(e) => setPasswordData({ ...passwordData, nuevaContrasena: e.target.value })}
              className="user-input"
              
              />
            
              
            <button className="user-button" type="submit">
              Cambiar Contraseña
            </button>
            </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DriverProfilePage;
