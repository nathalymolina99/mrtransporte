import { Router } from 'express';
import {
    registerDriver,
    getDrivers,
    updateDriver,
    deleteDriverByRut,
    registerPassenger,
    getPassengers,
    updatePassenger,
    changePassword,
    deletePassengerByRut,
    createAssignment,
    getAssignments,
    updateAssignment,
    deleteAssignment,
    createRoute,
    updateRoute,
    deleteRoute,
    getAllRoutes,
    updateIncidencia,
    deleteIncidencia,
    getAllIncidencias,
    createVehicle,
    deleteVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicleDriver,
    updateVehicleAvailability,
    cAdmin,
    actualizarContrasena,
    updateDriverStatus,
    updatePassengerStatus
} from '../controllers/adminController.js';

import { auth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/drivers', registerDriver); 
router.get('/drivers', getDrivers); 
router.put('/drivers/:rut', updateDriver); 
router.patch('/drivers/:rut', updateDriverStatus); 
router.delete('/drivers/:rut', deleteDriverByRut);

router.post('/passengers', registerPassenger); 
router.get('/passengers', getPassengers); 
router.put('/passengers/:rut', updatePassenger) 
router.patch('/passengers/:rut',updatePassengerStatus ); 
router.delete('/passengers/:rut', deletePassengerByRut);

router.patch('/change-password', changePassword); 

router.post('/assignments', createAssignment);
router.get('/assignments', getAssignments);
router.put('/assignments/:id', updateAssignment);
router.delete('/assignments/:id', deleteAssignment);

router.post('/routes',auth, createRoute);
router.put('/routes/:id',auth, updateRoute);
router.delete('/routes/:id',auth, deleteRoute);
router.get('/routes', auth,getAllRoutes);

router.put('/incidencias/:id', updateIncidencia); 
router.delete('/incidencias/:id', deleteIncidencia); 
router.get('/incidencias', getAllIncidencias); 

router.post('/vehicles', createVehicle);
router.get('/vehicles', getAllVehicles);
router.get('/vehicles/:id', getVehicleById);
router.patch('/vehicles/:id/availability', updateVehicleAvailability);
router.patch('/vehicles/:id/driver', updateVehicleDriver);
router.delete('/vehicles/:id', deleteVehicle);

router.post('/crear', cAdmin);
router.put('/actualizar-contrasena', auth, actualizarContrasena); 


export default router;


