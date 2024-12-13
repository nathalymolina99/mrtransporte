
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  rut: {
    type: String,
    required: true,
    unique: true, 
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


export default mongoose.model('Admin', adminSchema);

