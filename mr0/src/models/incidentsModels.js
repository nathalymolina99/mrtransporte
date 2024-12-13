import mongoose from "mongoose";

export const estadoIncidenciaEnum = {
  REPORTADA: 'reportada',
  EN_PROCESO: 'en proceso',
  RESUELTA: 'resuelta',
};

const incidentsSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ['reportada', 'en proceso', 'resuelta'],
    default: 'reportada',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'createdByModel',
  },
  createdByModel: {
    type: String,
    required: true,
    enum: ['driver', 'passenger'],
  },
  relatedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  relatedPassenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
  },
  idIncidents: {
    type: String,
    unique: true,
    default: function () {
      return `${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
    },
  },
}, { timestamps: true });


export default mongoose.model('Incidents', incidentsSchema);
