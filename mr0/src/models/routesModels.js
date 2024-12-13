import mongoose from "mongoose";

const routesSchema = new mongoose.Schema({
  idRoutes: { 
    type: String, 
    unique: true 
  },
  fechaRealizacion: {
    type: Date,
    required: true
  },
  horaComienzo: { 
    type: Date, 
    required: true 
  },
  horaFinalizacionEstimada: { 
    type: Date, 
    required: true 
  },
  conductor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver',
    required: true 
  },
  idAsignacion: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true 
  },
}, { timestamps: true });

routesSchema.pre('save', async function(next) {
  if (!this.idRoutes) {
    const fecha = this.fechaRealizacion.toISOString().split('T')[0].replace(/-/g, '');
    let sufijo = '';
    let idRoutes = `R${fecha}${sufijo}`;
    let routesExistente = await mongoose.model('Routes').findOne({ idRoutes });
    
    while (routesExistente) {
      sufijo = sufijo === '' ? 'A' : String.fromCharCode(sufijo.charCodeAt(0) + 1);
      idRoutes = `R${fecha}${sufijo}`;
      routesExistente = await mongoose.model('Routes').findOne({ idRoutes });
    }
  
    this.idRoutes = idRoutes;
  }
  next();
});

export default mongoose.model('Routes', routesSchema);
