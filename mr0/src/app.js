import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import adminRoutes from './routes/adminRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import incidentsRoutes from './routes/incidentsRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"], 
    credentials: true, 
  })
);
app.use(express.json()); 
app.use(morgan('dev')); 
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/passenger', passengerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/incidents', incidentsRoutes);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

if (process.env.NODE_ENV === 'production') {
  const path = await import('path');
  app.use(express.static('client/dist')); 

  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'dist', 'index.html')); 
  });
}

app.use((err, req, res, next) => {
  console.error('Error global:', err.stack); 
  res.status(500).json({ message: 'Error interno del servidor' }); 
});

export default app;

app.post('/api/incidents/', async (req, res) => {
  try {
    const incidencia = await Incidents.create(req.body);
    res.status(201).json(incidencia);
  } catch (err) {
    console.error('Error al crear la incidencia:', err.message);
    res.status(500).json({ error: err.message });
  }
});
