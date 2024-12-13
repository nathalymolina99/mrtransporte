import React, { useEffect, useState } from 'react';
import { usePassengerProfile } from '../../context/passengerProfile';
import '../../App.css';
import { toast } from 'react-toastify';

const PassengerProfilePage = () => {
  const { profile, getProfile, updateProfile, changePassword } = usePassengerProfile();
  const [editProfile, setEditProfile] = useState({ telefono: '', direccion: '' });
  const [passwordData, setPasswordData] = useState({ contrasenaActual: '', nuevaContrasena: '' });
  const [editando, setEditando] = useState(false);
  const [cambiandoContrasena, setCambiandoContrasena] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editProfile);
      toast.success('Perfil actualizado correctamente');
      setEditando(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordData);
      setPasswordData({ contrasenaActual: '', nuevaContrasena: '' });
      setCambiandoContrasena(false);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Mi Perfil</h2>
      <div className="profile-content">
        {!editando ? (
          <>
            {profile && (
              <div className="profile-info">
                <p><strong>RUT:</strong> {profile.rut}</p>
                <p><strong>Nombre:</strong> {profile.nombre} {profile.apellido}</p>
                <p><strong>Teléfono:</strong> {profile.telefono}</p>
                <p><strong>Dirección:</strong> {profile.direccion}</p>
              </div>
            )}
            <button className="profile-button edit" onClick={() => setEditando(true)}>
              Editar Perfil
            </button>
            <button className="profile-button edit" onClick={() => setCambiandoContrasena(!cambiandoContrasena)}>
              {cambiandoContrasena ? 'Cancelar Cambio de Contraseña' : 'Cambiar Contraseña'}
            </button>
          </>
        ) : (
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="text"
                value={editProfile.telefono}
                onChange={(e) => setEditProfile({ ...editProfile, telefono: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                value={editProfile.direccion}
                onChange={(e) => setEditProfile({ ...editProfile, direccion: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button className="profile-button save" type="submit">
                Guardar
              </button>
              <button className="profile-button cancel" onClick={() => setEditando(false)}>
                Cancelar
              </button>
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

export default PassengerProfilePage;
