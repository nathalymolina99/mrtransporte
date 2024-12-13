import  Incidents  from '../models/incidentsModels.js'; 

export const createIncidencia = async (req, res) => {
  try {
    const { descripcion, relatedDriver, relatedPassenger } = req.body; 
    const createdBy = req.user.id; 
    const createdByModel = req.user.role; 

    if (!descripcion || !createdBy || !createdByModel) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (!["driver", "passenger"].includes(createdByModel.toLowerCase())) {
      return res.status(400).json({
        message: 'El campo "createdByModel" debe ser "driver" o "passenger".',
      });
    }

    if (createdByModel === "passenger" && !relatedDriver) {
      return res.status(400).json({ message: "Debe seleccionarse un conductor." });
    }
    if (createdByModel === "driver" && !relatedPassenger) {
      return res.status(400).json({ message: "Debe seleccionarse un pasajero." });
    }

    const incidenciaData = {
      descripcion,
      estado: "reportada",
      createdBy,
      createdByModel,
      relatedDriver: createdByModel === "passenger" ? relatedDriver : null,
      relatedPassenger: createdByModel === "driver" ? relatedPassenger : null,
    };

    const nuevaIncidencia = new Incidents(incidenciaData);
    await nuevaIncidencia.save();

    res.status(201).json({
      message: "Incidencia creada exitosamente.",
      incidencia: nuevaIncidencia,
    });
  } catch (error) {
    console.error("Error al crear la incidencia:", error.message);
    res.status(500).json({
      message: "Error al crear la incidencia.",
      error: error.message,
    });
  }
};

export const getIncidenciasByUser = async (req, res) => {
  try {
    const { id: userId, role: userType } = req.user;

    const query = {
      createdBy: userId,
      createdByModel: userType,
    };

    const incidencias = await Incidents.find(query)
      .populate(userType === 'driver' ? 'relatedPassenger' : 'relatedDriver', 'nombre apellido')
      .sort({ createdAt: -1 });

    res.status(200).json(incidencias || []);
  } catch (error) {
    console.error("Error al obtener las incidencias:", error.message);
    res.status(500).json({ message: "Error al obtener las incidencias.", error: error.message });
  }
};