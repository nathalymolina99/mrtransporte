import Passenger from '../models/passengerModels.js'; 
import Assignment from '../models/assignmentModels.js'; 
import Vehicle from '../models/vehicleModels.js'; 
import Driver from '../models/driverModels.js';
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

export const getPassengerProfile = async (req, res) => {
  try {
    console.log("ID de usuario autenticado:", req.user.id);

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'ID de pasajero inválido' });
    }

    const passenger = await Passenger.findById(req.user.id).select('-password');

    if (!passenger) {
      return res.status(404).json({ message: 'Pasajero no encontrado' });
    }

    res.json({
      id: passenger._id.toString(),
      rut: passenger.rut,
      nombre: passenger.nombre,
      apellido: passenger.apellido,
      telefono: passenger.telefono,
      direccion: passenger.direccion,
      role: passenger.role,
      disponible: passenger.disponible,
      primerIngreso: passenger.primerIngreso
    });
  } catch (error) {
    console.error("Error completo al obtener perfil de pasajero:", error);
    res.status(500).json({ 
      message: 'Error al obtener el perfil', 
      error: error.message 
    });
  }
};

export const editarPerfil = async (req, res) => {
  try {
    const { id } = req.user;
    const { telefono, nombre, apellido, direccion } = req.body;

    if (!telefono && !nombre && !apellido && !direccion) {
      return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar' });
    }

    const actualizaciones = {};
    if (telefono) actualizaciones.telefono = telefono;
    if (nombre) actualizaciones.nombre = nombre;
    if (apellido) actualizaciones.apellido = apellido;
    if (direccion) actualizaciones.direccion = direccion;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de pasajero no válido' });
    }

    const pasajeroActualizado = await Passenger.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true }
    ).select('-password').catch(err => {
      console.error('Error de Mongoose:', err.message);
      throw new Error('Error al interactuar con la base de datos');
    });

    if (!pasajeroActualizado) {
      return res.status(404).json({ message: 'Pasajero no encontrado' });
    }

    return res.status(200).json(pasajeroActualizado);
  } catch (error) {
    console.error('Error en editarPerfil:', error);
    return res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
};

export const actualizarContrasena = async (req, res) => {
  try {
    const { contrasenaActual, nuevaContrasena } = req.body;
    const pasajero = await Passenger.findById(req.user.id);

    if (!pasajero) {
      return res.status(404).json({ message: 'Pasajero no encontrado' });
    }

    
    const isMatch = await bcrypt.compare(contrasenaActual, pasajero.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    
    const salt = await bcrypt.genSalt(10);
    pasajero.password = await bcrypt.hash(nuevaContrasena, salt);
    await pasajero.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la contraseña', error: err.message });
  }
};

export const crearContrasenaInicial = async (req, res) => {
  try {
    const { id } = req.user;
    const { nuevaContrasena } = req.body;

    const pasajero = await Passenger.findById(id);
    if (!pasajero) {
      return res.status(404).json({ message: 'Pasajero no encontrado' });
    }

    if (!pasajero.primerIngreso) {
      return res.status(400).json({ message: 'La contraseña ya ha sido creada anteriormente' });
    }

    const salt = await bcrypt.genSalt(10);
    pasajero.password = await bcrypt.hash(nuevaContrasena, salt);
    pasajero.primerIngreso = false; 
    await pasajero.save();
    res.json({ message: 'Contraseña creada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la contraseña inicial', error: err.message });
  }
};

export const verConductorAsignado = async (req, res) => {
  try {
    const userRut = req.user?.rut; 
    if (!userRut) {
      return res.status(400).json({ message: 'RUT del usuario es requerido' });
    }

    const asignacion = await Assignment.findOne({ rutsPasajeros: userRut });
    if (!asignacion) {
      return res.status(404).json({ message: 'No tienes un conductor asignado' });
    }

    const conductor = await Driver.findOne({ rut: asignacion.rutConductor });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const vehiculo = await Vehicle.findOne({ rutConductor: asignacion.rutConductor });
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado para el conductor' });
    }

    res.json({
      conductor: {
        nombre: conductor.nombre,
        apellido: conductor.apellido,
        telefono: conductor.telefono,
        rut: conductor.rut,
      },
      vehiculo: {
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        color: vehiculo.color,
        patente: vehiculo.patente,
      },
    });
  } catch (error) {
    console.error('Error al obtener el conductor asignado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getDriversA = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.setHeader('Cache-Control', 'no-store'); 
    return res.status(200).json(drivers);
  } catch (error) {
    console.error('Error al obtener los conductores:', error);
    return res.status(500).json({ message: 'Error al obtener los conductores' });
  }
};