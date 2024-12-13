import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import 
{ 
    getPassengerProfile,
    editarPerfil,
    actualizarContrasena,
    crearContrasenaInicial,
    verConductorAsignado,
    getDriversA
     
} 
from '../controllers/passengerController.js';

const router = express.Router();

router.get('/profile', auth, getPassengerProfile);
router.put('/profile',auth, editarPerfil); 
router.put('/password', auth, actualizarContrasena ); 
router.post('/initial-password', auth,crearContrasenaInicial); 
router.get('/assigned-driver', auth, verConductorAsignado);
router.get('/drivers', auth, getDriversA);

export default router;