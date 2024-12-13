import React, { useState } from 'react';
import { useAdminPassword } from '../../context/adminProfile'; 

const ChangeAdminPasswordPage = () => {
    const { changePassword } = useAdminPassword(); 
    const [passwordData, setPasswordData] = useState({
      contrasenaActual: '',
      nuevaContrasena: '',
      confirmarContrasena: '',
    });
  
    const handleChangePassword = async (e) => {
      e.preventDefault();
  
      if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
        alert('Las contraseñas nuevas no coinciden');
        return;
      }
  
      try {
        
        await changePassword({
          contrasenaActual: passwordData.contrasenaActual,
          nuevaContrasena: passwordData.nuevaContrasena,
        });
    
        setPasswordData({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
      }
    };
  
    return (
      <div className="user-container">
        <div className="user-section">
        <h2 className='user-title'>Cambiar Contraseña</h2>
        
        <form onSubmit={handleChangePassword} className="user-form">
          
            <input
              type="password"
              placeholder="INGRESE SU CONTRASEÑA ACTUAL"
              value={passwordData.contrasenaActual}
              onChange={(e) => setPasswordData({ ...passwordData, contrasenaActual: e.target.value })}
              className="user-input"
              required
            />
            
            <input
              type="password"
              placeholder="INGRESE SU CONTRASEÑA NUEVA"
              value={passwordData.nuevaContrasena}
              onChange={(e) => setPasswordData({ ...passwordData, nuevaContrasena: e.target.value })}
              className="user-input"
              required
            />

            <input
              type="password"
              placeholder="CONFIRME SU CONTRASEÑA NUEVA"
              value={passwordData.confirmarContrasena}
              onChange={(e) => setPasswordData({ ...passwordData, confirmarContrasena: e.target.value })}
               className="user-input"
              required
            />
         
          <button type="submit" className="user-button">Cambiar Contraseña</button>
        </form>
        </div>
        
      </div>
    );
  };
  
  export default ChangeAdminPasswordPage;