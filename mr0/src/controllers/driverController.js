import DriverModel from '../models/driverModels.js'; 
import Routes from '../models/routesModels.js'; 
import Driver from '../models/driverModels.js';
import Passenger from '../models/passengerModels.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const getDriverProfile = async (req, res) => {
  try {
    console.log("ID de usuario autenticado:", req.user.id);

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'ID de conductor inválido' });
    }
    const driver = await DriverModel.findById(req.user.id).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    res.json({
      id: driver._id.toString(),
      rut: driver.rut,
      nombre: driver.nombre,
      apellido: driver.apellido,
      telefono: driver.telefono,
      role: driver.role,
      disponible: driver.disponible,
      primerIngreso: driver.primerIngreso
    });
  } catch (error) {
    console.error("Error completo al obtener perfil de conductor:", error);
    res.status(500).json({ 
      message: 'Error al obtener el perfil', 
      error: error.message 
    });
  }
};

export const debugDriverCollection = async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection('drivers');
    const drivers = await collection.find({}).toArray();
    const count = await collection.countDocuments();

    res.json({
      totalDrivers: count,
      drivers: drivers.map(driver => ({
        id: driver._id.toString(),
        rut: driver.rut,
        nombre: driver.nombre
      }))
    });
  } catch (error) {
    console.error("Error en depuración de conductores:", error);
    res.status(500).json({ 
      message: 'Error en depuración', 
      error: error.message 
    });
  }
};

export const updateDriverProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { telefono, nombre, apellido } = req.body;

    if (!telefono && !nombre && !apellido) {
      return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar' });
    }

    const actualizaciones = {};
    if (telefono) actualizaciones.telefono = telefono;
    if (nombre) actualizaciones.nombre = nombre;
    if (apellido) actualizaciones.apellido = apellido;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de conductor no válido' });
    }

    const conductorActualizado = await Driver.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).select('-password').catch(err => {
      console.error('Error de Mongoose:', err.message);
      throw new Error('Error al interactuar con la base de datos');
    });

    if (!conductorActualizado) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    return res.status(200).json(conductorActualizado);
  } catch (error) {
    console.error('Error en editarPerfilDriver:', error);
    return res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
};

export const actualizarContrasena = async (req, res) => {
  try {
    const { contrasenaActual, nuevaContrasena } = req.body;
    const conductor = await Driver.findById(req.user.id);

    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    const isMatch = await bcrypt.compare(contrasenaActual, conductor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    conductor.password = await bcrypt.hash(nuevaContrasena, salt);
    await conductor.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    console.error('Error en actualizarContrasenaDriver:', err);
    res.status(500).json({ message: 'Error al actualizar la contraseña', error: err.message });
  }
};

export const crearContrasenaInicial = async (req, res) => {
  try {
    const { id } = req.user;
    const { nuevaContrasena } = req.body;

    const conductor = await Driver.findById(id);
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }

    if (!conductor.primerIngreso) {
      return res.status(400).json({ message: 'La contraseña ya ha sido creada anteriormente' });
    }

    const salt = await bcrypt.genSalt(10);
    conductor.password = await bcrypt.hash(nuevaContrasena, salt);
    conductor.primerIngreso = false;
    await conductor.save();

    res.json({ message: 'Contraseña creada con éxito' });
  } catch (err) {
    console.error('Error en crearContrasenaInicialDriver:', err);
    res.status(500).json({ message: 'Error al crear la contraseña inicial', error: err.message });
  }
};

export const getRoutesByDriver = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const driverId = req.user.id;
    const rutas = await Routes.find({ conductor: driverId })
      .populate({
        path: 'idAsignacion',
        populate: {
          path: 'conductor',
          select: 'rut nombre', 
        },
      })
      .lean();

    const rutasConDetallesPasajeros = await Promise.all(
      rutas.map(async (ruta) => {
        if (ruta.idAsignacion?.rutsPasajeros?.length) {
          const detallesPasajeros = await Passenger.find(
            { rut: { $in: ruta.idAsignacion.rutsPasajeros } },
            'nombre apellido telefono direccion rut' 
          ).lean();

          return {
            ...ruta,
            pasajeros: detallesPasajeros, 
          };
        }
        return { ...ruta, pasajeros: [] }; 
      })
    );

    res.status(200).json(rutasConDetallesPasajeros);
  } catch (error) {
    console.error('Error al obtener rutas del conductor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPassengersA = async (req, res) => {
  try {
    const passengers = await Passenger.find().select("-password");
    res.setHeader("Cache-Control", "no-store"); 
    return res.status(200).json(passengers);
  } catch (error) {
    console.error("Error al obtener los pasajeros:", error.message);
    return res.status(500).json({ message: "Error al obtener los pasajeros" });
  }
};