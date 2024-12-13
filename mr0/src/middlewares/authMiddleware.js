import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import Admin from '../models/adminModels.js';
import Driver from '../models/driverModels.js';
import Passenger from '../models/passengerModels.js';


export const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      console.log("No se encontró token en las cookies");
      return res.status(401).json({ message: "No autorizado: Token no proporcionado" });
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);
    console.log("Token decodificado:", decoded);

    if (!decoded.modelo || !decoded.id) {
      console.log("Token inválido o incompleto:", decoded);
      return res.status(401).json({ message: "Token inválido o incompleto" });
    }

    let usuario;
    if (decoded.modelo === "admin") {
      usuario = await Admin.findById(decoded.id);
    } else if (decoded.modelo === "driver") {
      usuario = await Driver.findById(decoded.id);
    } else if (decoded.modelo === "passenger") {
      usuario = await Passenger.findById(decoded.id);
    }

    if (!usuario) {
      console.log("Usuario no encontrado con ID:", decoded.id);
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = {
      id: usuario._id.toString(),
      role: usuario.role || decoded.modelo, 
      rut: usuario.rut,
    };

    console.log("Usuario autenticado en middleware:", req.user);
    next();
  } catch (error) {
    console.error("Error de autenticación completo:", error);
    return res.status(401).json({
      message: "No autorizado",
      errorName: error.name,
      errorMessage: error.message,
    });
  }
};
