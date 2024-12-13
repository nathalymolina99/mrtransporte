import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModels.js';
import Driver from '../models/driverModels.js';
import Passenger from '../models/passengerModels.js';

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_EXPIRATION = '1h';

function validarRut(rut) {
  rut = rut.toString().replace(/[.-]/g, '').toUpperCase();
  if (rut.length < 2) {
    return { valid: false, message: 'RUT demasiado corto' };
  }

  const dv = rut.slice(-1);
  const rutCuerpo = rut.slice(0, -1);
  if (!/^\d+$/.test(rutCuerpo)) {
    return { valid: false, message: 'El RUT debe contener solo números' };
  }

  let suma = 0;
  let multiplicador = 2;
  for (let i = rutCuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(rutCuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return { valid: dvCalculado === dv, message: dvCalculado === dv ? 'RUT válido' : 'Dígito verificador incorrecto' };
}

async function verificarContraseña(usuario, password) {
  return await bcrypt.compare(password, usuario.password);
}

async function autenticarUsuario(rut, password) {
  const { valid, message } = validarRut(rut);
  if (!valid) throw new Error(message);

  let usuario;
  let modelo;

  usuario = await Admin.findOne({ rut });
  if (usuario) modelo = 'admin';

  if (!usuario) {
    usuario = await Driver.findOne({ rut });
    if (usuario) modelo = 'driver';
  }

  if (!usuario) {
    usuario = await Passenger.findOne({ rut });
    if (usuario) modelo = 'passenger';
  }

  if (!usuario) throw new Error('Credenciales incorrectas');

  const esValida = await verificarContraseña(usuario, password);
  if (!esValida) throw new Error('Credenciales incorrectas');

  const token = jwt.sign(
    { id: usuario._id, role: usuario.role, modelo },
    TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );

  return { token, usuario: { id: usuario._id, role: usuario.role }, modelo };
}

export const iniciarSesion = async (req, res) => {
  try {
    const { rut, password } = req.body;
    if (!rut || !password) {
      return res.status(400).json({ message: 'RUT y contraseña son requeridos' });
    }

    const result = await autenticarUsuario(rut, password);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, 
      path: '/',
    });

    res.json({ id: result.usuario.id, role: result.usuario.role, modelo: result.modelo });
  } catch (err) {
    console.error('Error en inicio de sesión:', err.message);
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    res.json({ valid: true, userId: decoded.id, role: decoded.role });
  } catch (err) {
    console.error('Error al verificar el token:', err.message);
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const cerrarSesion = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada exitosamente' });
};
