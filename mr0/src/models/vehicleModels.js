import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  rutConductor: {
    type: String,
    required: true, 
    trim: true, 
  },
  marca: {
    type: String,
    required: true,
  },
  modelo: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  patente: {
    type: String,
    required: true,
    unique: true,
  },
  disponible: {
      type: Boolean,
      default: true,
  },
}, { timestamps: true });
  export default mongoose.model('Vehicle', vehicleSchema);
  