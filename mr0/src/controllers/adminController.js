import User from '../models/userModels.js'
import Driver from '../models/driverModels.js'
import Passenger from '../models/passengerModels.js'
import Assignment from '../models/assignmentModels.js'; 
import Routes from '../models/routesModels.js'; 
import Incidents from '../models/incidentsModels.js';
import Vehicle from '../models/vehicleModels.js';
import Admin from '../models/adminModels.js';
import bcrypt from "bcryptjs";
import mongoose from 'mongoose'; 
import { createAccessToken } from "../libs/jwt.js";

const normalizeRut = (rut) => {
  return rut.trim().toUpperCase(); 
};

export const registerDriver = async (req, res) => {
    try {
        const { rut, nombre, apellido, telefono } = req.body;

        if (!rut || !nombre || !apellido || !telefono) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const driverFound = await Driver.findOne({ rut });
        if (driverFound) {
            return res.status(400).json({ message: ["El RUT ya está registrado"] });
        }
        
        const initialPassword = rut.replace(/-/g, '');
        const passwordHash = await bcrypt.hash(initialPassword, 10);        
        const newDriver = new Driver({
            rut,
            nombre,
            apellido,
            telefono,
            password: passwordHash,
            primerIngreso: true,
            disponible: false
        });

        const driverSaved = await newDriver.save();
        const token = await createAccessToken({ id: driverSaved._id });

        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        res.json({
            id: driverSaved._id,
            rut: driverSaved.rut,
            nombre: driverSaved.nombre,
            apellido: driverSaved.apellido,
        });
    } catch (error) {
        console.error("Error en registerDriver:", error); 
        res.status(500).json({ message: error.message });
    }
};

export const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find()
            .select('-password');
        res.json(drivers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateDriver = async (req, res) => {
    try {
        const { rut } = req.params; 
        const { nombre, apellido, telefono } = req.body;      
        const driverUpdated = await Driver.findOneAndUpdate(
            { rut }, 
            { nombre, apellido, telefono }, 
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password'); 
        
        if (!driverUpdated) {
            return res.status(404).json({ message: "Conductor no encontrado" });
        }
        
        return res.json(driverUpdated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateDriverStatus = async (req, res) => {
  try {
    const { rut } = req.params;
    const { disponible } = req.body;
    const normalizedRut = normalizeRut(rut);
    console.log("RUT normalizado:", normalizedRut);

    const updatedDriver = await Driver.findOneAndUpdate(
      { rut: normalizedRut },
      { disponible },
      { new: true, runValidators: true }
    );

    if (!updatedDriver) {
      console.log("Conductor no encontrado en la base de datos.");
      return res.status(404).json({ message: "Conductor no encontrado" });
    }

    console.log("Conductor actualizado:", updatedDriver);
    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error("Error al actualizar conductor:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDriverByRut = async (req, res) => {
    try {
        const { rut } = req.params;
        const driverDeleted = await Driver.findOneAndDelete({ rut });

        if (!driverDeleted) {
            return res.status(404).json({ message: "Conductor no encontrado" });
        }

        return res.json({ message: "Conductor eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const registerPassenger = async (req, res) => {
    try {
        const { rut, nombre, apellido, telefono, direccion } = req.body;

        if (!rut || !nombre || !apellido || !telefono || !direccion) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }
       
        const passengerFound = await Passenger.findOne({ rut });
        if (passengerFound) {
            return res.status(400).json({ message: ["El RUT ya está registrado"] });
        }

        const initialPassword = rut.replace(/-/g, '');
        const passwordHash = await bcrypt.hash(initialPassword, 10);
        const newPassenger = new Passenger({
            rut,
            nombre,
            apellido,
            telefono,
            direccion,
            password: passwordHash,
            primerIngreso: true,
            disponible: true
        });

        const passengerSaved = await newPassenger.save();       
        const token = await createAccessToken({ id: passengerSaved._id });
        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        res.json({
            id: passengerSaved._id,
            rut: passengerSaved.rut,
            nombre: passengerSaved.nombre,
            apellido: passengerSaved.apellido,
        });
    } catch (error) {
        console.error("Error en registerPassenger:", error);  
        res.status(500).json({ message: error.message });
    }
};

export const getPassengers = async (req, res) => {
    try {
        const passengers = await Passenger.find().select('-password');
        res.json(passengers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updatePassenger = async (req, res) => {
    try {
        const { rut } = req.params; 
        const { nombre, apellido, telefono, direccion } = req.body;
        const passengerUpdated = await Passenger.findOneAndUpdate(
            { rut }, 
            { nombre, apellido, telefono, direccion }, 
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password'); 
        
        if (!passengerUpdated) {
            return res.status(404).json({ message: "Pasajero no encontrado" });
        }
        
        return res.json(passengerUpdated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const passengerStatus = async (req, res) => {
    try {
        const { rut } = req.params; 
        const { disponible } = req.body; 
        const passengerUpdated = await Passenger.findOneAndUpdate(
            { rut }, 
            { disponible }, 
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password'); 
        
        if (!passengerUpdated) {
            return res.status(404).json({ message: "Pasajero no encontrado" });
        }
        
        return res.json(passengerUpdated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deletePassengerByRut = async (req, res) => {
    try {
        
        const { rut } = req.params;
        const passengerDeleted = await Passenger.findOneAndDelete({ rut });
        
        if (!passengerDeleted) {
            return res.status(404).json({ message: "Pasajero no encontrado" });
        }

        return res.json({ message: "Pasajero eliminado exitosamente" });
    } catch (error) {
       
        return res.status(500).json({ message: error.message });
    }
};

export const updatePassengerStatus = async (req, res) => {
  try {
    const { rut } = req.params;
    const { disponible } = req.body;

    console.log("RUT recibido:", rut);
    console.log("Estado recibido:", disponible);

    if (!rut || disponible === undefined) {
      return res.status(400).json({ message: "RUT y estado de disponibilidad son requeridos." });
    }

    const normalizedRut = rut.trim().toUpperCase();
    const updatedPassenger = await Passenger.findOneAndUpdate(
      { rut: normalizedRut },
      { disponible },
      { new: true, runValidators: true }
    );

    if (!updatedPassenger) {
      return res.status(404).json({ message: "Pasajero no encontrado." });
    }

    res.status(200).json(updatedPassenger);
  } catch (error) {
    console.error("Error al actualizar pasajero:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: ["La contraseña actual es incorrecta"],
            });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        user.primerIngreso = false;
        await user.save();

        return res.json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createAssignment = async (req, res) => {
  try {
    const { conductor, rutsPasajeros } = req.body;

    console.log("Datos recibidos:", { conductor, rutsPasajeros });

    if (!conductor || !rutsPasajeros || !Array.isArray(rutsPasajeros) || rutsPasajeros.length === 0) {
      return res.status(400).json({
        message: "El RUT del conductor y al menos un RUT de pasajero son obligatorios.",
      });
    }

    const driver = await Driver.findOne({ rut: conductor });
    if (!driver) {
      console.error("Conductor no encontrado:", conductor);
      return res.status(404).json({ message: "Conductor no encontrado." });
    }

    const passengers = await Passenger.find({ rut: { $in: rutsPasajeros } });
    console.log("Pasajeros encontrados:", passengers);

    if (passengers.length !== rutsPasajeros.length) {
      console.error("Algunos pasajeros no existen:", {
        rutsEsperados: rutsPasajeros,
        rutsEncontrados: passengers.map((p) => p.rut),
      });
      return res.status(400).json({
        message: "Algunos de los pasajeros proporcionados no existen.",
      });
    }

    const assignment = new Assignment({
      conductor: driver._id,
      rutConductor: conductor,
      rutsPasajeros,
    });

    await assignment.save();
    console.log("Asignación creada:", assignment);

    return res.status(201).json({
      message: "Asignación creada exitosamente.",
      assignment,
    });
  } catch (error) {
    console.error("Error al crear la asignación:", error.message);
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { rutConductor, rutsPasajeros } = req.body;

  try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'ID de asignación inválido' });
      }

      if (!rutConductor || !rutsPasajeros || rutsPasajeros.length === 0) {
          return res.status(400).json({ message: 'Datos de asignación incompletos' });
      }

      const updatedAssignment = await Assignment.findByIdAndUpdate(
          id,
          { 
              rutConductor, 
              rutsPasajeros 
          },
          { 
              new: true,    
              runValidators: true 
          }
      );

      if (!updatedAssignment) {
          return res.status(404).json({ message: 'Asignación no encontrada' });
      }

      return res.status(200).json(updatedAssignment);
  } catch (error) {
      console.error('Error detallado al actualizar la asignación:', error);
      return res.status(500).json({ 
          message: 'Error interno del servidor', 
          errorDetails: error.message 
      });
  }
};

export const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    return res.status(200).json({ message: 'Asignación eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la asignación' });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Routes.find().populate('conductor').populate('idAsignacion');
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createRoute = async (req, res) => {
  try {
      console.log("Datos recibidos para crear la ruta:", req.body);

      const { idAsignacion, fechaRealizacion, horaComienzo, horaFinalizacionEstimada } = req.body;

      if (!idAsignacion || !fechaRealizacion || !horaComienzo || !horaFinalizacionEstimada) {
          return res.status(400).json({ message: "Faltan datos requeridos para crear la ruta" });
      }

      const inicioHora = new Date(horaComienzo);
      const finHora = new Date(horaFinalizacionEstimada);

      if (isNaN(inicioHora) || isNaN(finHora)) {
          return res.status(400).json({ message: "Hora de comienzo o finalización inválida" });
      }

      const assignment = await Assignment.findById(idAsignacion).populate("conductor");
      if (!assignment) {
          return res.status(404).json({ message: "Asignación no encontrada" });
      }

      const nuevaRuta = new Routes({
          fechaRealizacion: new Date(fechaRealizacion),
          horaComienzo: inicioHora,
          horaFinalizacionEstimada: finHora,
          conductor: assignment.conductor._id,
          idAsignacion: assignment._id,
      });

      const rutaGuardada = await nuevaRuta.save();
      res.status(201).json(rutaGuardada);
  } catch (error) {
      console.error("Error al crear la ruta:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

export const updateRoute = async (req, res) => {
  try {
      console.log("Datos recibidos para actualizar la ruta:", req.body);

      const { id } = req.params;
      const { fechaRealizacion, horaComienzo, horaFinalizacionEstimada, idAsignacion } = req.body;

      const ruta = await Routes.findById(id);
      if (!ruta) {
          return res.status(404).json({ message: "Ruta no encontrada" });
      }

      if (fechaRealizacion) ruta.fechaRealizacion = new Date(fechaRealizacion);
      if (horaComienzo) ruta.horaComienzo = new Date(horaComienzo);
      if (horaFinalizacionEstimada) ruta.horaFinalizacionEstimada = new Date(horaFinalizacionEstimada);
      if (idAsignacion) ruta.idAsignacion = idAsignacion;

      const rutaActualizada = await ruta.save();
      res.status(200).json(rutaActualizada);
  } catch (error) {
      console.error("Error al actualizar la ruta:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const { id } = req.params;

    let rutaEliminada = await Routes.findByIdAndDelete(id);

    if (!rutaEliminada) {
      rutaEliminada = await Routes.findOneAndDelete({ idRoutes: id });
    }

    if (!rutaEliminada) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    res.status(200).json({ message: 'Ruta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la ruta:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

  export const updateIncidencia = async (req, res) => {
    const { id } = req.params;
    let { descripcion, estado } = req.body;
  
    try {
      console.log("Datos recibidos para actualización:", { id, descripcion, estado });
  
      if (typeof estado === "object" && estado.estado) {
        estado = estado.estado;
      }
  
      if (!descripcion && !estado) {
        return res.status(400).json({ message: "No se enviaron datos para actualizar." });
      }
  
      if (estado && !["reportada", "en proceso", "resuelta"].includes(estado)) {
        return res.status(400).json({ message: "Estado inválido." });
      }
  
      const actualizacion = {};
      if (descripcion) actualizacion.descripcion = descripcion;
      if (estado) actualizacion.estado = estado;
  
      const incidencia = await Incidents.findByIdAndUpdate(
        id,
        actualizacion,
        { new: true, runValidators: true }
      );
  
      if (!incidencia) {
        return res.status(404).json({ message: "Incidencia no encontrada." });
      }
  
      res.json({ message: "Incidencia actualizada con éxito", incidencia });
    } catch (error) {
      console.error("Error al actualizar la incidencia:", error.message);
      res.status(500).json({ message: "Error interno al actualizar la incidencia." });
    }
  };
  
  
export const deleteIncidencia = async (req, res) => {
  const { id } = req.params;

  try {
    const incidenciaEliminada = await Incidents.findByIdAndDelete(id);

    if (!incidenciaEliminada) {
      return res.status(404).json({ message: "Incidencia no encontrada." });
    }

    res.json({
      message: "Incidencia eliminada físicamente.",
      incidencia: incidenciaEliminada,
    });
  } catch (error) {
    console.error("Error al eliminar incidencia:", error.message);
    res.status(500).json({ message: "Error interno al eliminar la incidencia." });
  }
};
  
export const getAllIncidencias = async (req, res) => {
  try {
    const incidencias = await Incidents.find().sort({ createdAt: -1 });

    if (!incidencias.length) {
      return res.status(404).json({ message: "No hay incidencias registradas." });
    }

    const populatedIncidencias = await Promise.all(
      incidencias.map(async (incidencia) => {
        if (incidencia.createdByModel === "driver") {
          const driver = await mongoose.model("Driver").findById(incidencia.createdBy, "nombre apellido");
          return { ...incidencia.toObject(), createdBy: driver };
        } else if (incidencia.createdByModel === "passenger") {
          const passenger = await mongoose.model("Passenger").findById(incidencia.createdBy, "nombre apellido");
          return { ...incidencia.toObject(), createdBy: passenger };
        }
        return incidencia;
      })
    );

    res.json({ message: "Incidencias obtenidas con éxito.", incidencias: populatedIncidencias });
  } catch (error) {
    console.error("Error al obtener todas las incidencias:", error.message);
    res.status(500).json({ message: "Error interno al obtener todas las incidencias." });
  }
};

  export const createVehicle = async (req, res) => {
    try {
      const vehicle = new Vehicle(req.body);
      await vehicle.save();
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const deleteVehicle = async (req, res) => {
    try {
      const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }
      res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateVehicleAvailability = async (req, res) => {
    try {
      const { disponible } = req.body;
      const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id, 
        { disponible },
        { new: true, runValidators: true }
      );
  
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }
  
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const updateVehicleDriver = async (req, res) => {
    const { id } = req.params; 
    const { rutConductor } = req.body; 
  
    try {
     
      const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { rutConductor }, 
        { new: true }
      );
  
      if (!vehicle) {
        return res.status(404).json({ message: "Vehículo no encontrado" });
      }
  
      res.status(200).json(vehicle);
    } catch (error) {
      console.error("Error al actualizar el conductor del vehículo:", error.message);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  export const getAllVehicles = async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getVehicleById = async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
export const cAdmin = async (req, res) => {
  try {
    const { rut, nombre, apellido, password } = req.body;

    
    const adminExistente = await Admin.findOne({ rut });
    if (adminExistente) {
      return res.status(400).json({ message: 'El administrador ya existe con este RUT' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const nuevoAdmin = new Admin({
      rut,
      nombre,
      apellido,
      password: passwordEncriptada,
    });

    await nuevoAdmin.save();
    res.status(201).json({ message: 'Administrador creado con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el administrador', error: err.message });
  }
};

export const actualizarContrasena = async (req, res) => {
  try {
    const { contrasenaActual, nuevaContrasena } = req.body;
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    const isMatch = await bcrypt.compare(contrasenaActual, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(nuevaContrasena, salt);
    await admin.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    console.error('Error en actualizarContrasenaAdmin:', err);
    res.status(500).json({ message: 'Error al actualizar la contraseña', error: err.message });
  }
};
