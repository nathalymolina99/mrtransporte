import express from 'express';
import {
  createIncidencia,
  getIncidenciasByUser
} from '../controllers/incidentsController.js'; 

import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", auth, createIncidencia);

router.get("/user", auth, getIncidenciasByUser);


export default router;