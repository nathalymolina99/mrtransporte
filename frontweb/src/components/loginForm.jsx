import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ rut: '', password: '' });
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const isValidRut = (rut) => {
    const regex = /^[0-9]+-[0-9kK]$/;
    return regex.test(rut);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidRut(credentials.rut)) {
      setErrorMessage('Por favor ingrese un RUT válido (formato: 12345678-9).');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', credentials, {
        withCredentials: true, 
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data && response.data.id && response.data.modelo) {
        setAuth(response.data); 
        const modelo = response.data.modelo.toLowerCase();

        switch (modelo) {
          case 'admin':
            navigate('/admin');
            break;
          case 'driver':
            navigate('/conductor');
            break;
          case 'passenger':
            navigate('/pasajero');
            break;
          default:
            setErrorMessage(`Tipo de usuario no válido: ${modelo}`);
        }
      } else {
        setErrorMessage('La respuesta no contiene los datos esperados');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-box">
      <p>Iniciar Sesión</p>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input
            required
            type="text"
            name="rut"
            value={credentials.rut}
            onChange={handleChange}
          />
          <label>RUT</label>
        </div>
        <div className="user-box">
          <input
            required
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
          <label>Contraseña</label>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-btn">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
