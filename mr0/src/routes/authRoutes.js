
import { Router } from 'express';
import { 
  iniciarSesion, 
  cerrarSesion, 
  verifyToken 
} from '../controllers/authController.js';

const router = Router();

router.post('/login', iniciarSesion); 
router.post('/logout', cerrarSesion);
router.get('/verify-token', verifyToken);

export default router;