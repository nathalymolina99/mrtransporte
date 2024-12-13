import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  rut: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'driver',
    enum: ['driver', 'admin', 'passenger']
  },
  telefono: {
    type: String,
    required: true,
  },
  disponible: {
    type: Boolean,
    default: false,
  },
  primerIngreso: {
    type: Boolean,
    default: true,
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Driver', driverSchema);
