import express from 'express';
import 
{
  getDriverProfile,
  updateDriverProfile,
  actualizarContrasena,
  crearContrasenaInicial,
  getRoutesByDriver,getPassengersA
} 
from '../controllers/driverController.js'; 

import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/perfil', auth, getDriverProfile);
router.put('/perfil', auth,updateDriverProfile);
router.put('/contrasena', auth,actualizarContrasena);
router.post('/contrasena-inicial', auth, crearContrasenaInicial);
router.get("/rutas", auth, getRoutesByDriver);
router.get('/passengers', auth, getPassengersA);

export default router;