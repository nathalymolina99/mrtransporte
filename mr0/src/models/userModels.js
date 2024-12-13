
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  rut: {
    type: String,
    required: [true, 'El RUT es obligatorio'],
    unique: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  role: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    enum: ['admin', 'conductor', 'pasajero']
  },
  telefono: {
    type: String,
  },
  direccion: {
    type: String,
    required: function() {
      return this.role === 'pasajero';
    }
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido', 'eliminado'],
    default: 'activo'
  },
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehiculo',
    required: function() {
      return this.role === 'conductor';
    }
  },
  primerIngreso: {
    type: Boolean,
    default: true
  },
  disponible: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});


export default mongoose.model('User', userSchema);
