import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  idAssignment: { 
    type: String,
    unique: true,
  },
  conductor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver", 
    required: true,
  },
  rutConductor: {  
    type: String,
    required: true
  },

  rutsPasajeros: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0 && v.length <= 4; 
      },
      message: "Debe haber entre 1 a 4 pasajeros",
    },
  },
}, { timestamps: true });

assignmentSchema.pre("save", async function (next) {
  if (!this.idAssignment) {
    const fecha = new Date().toISOString().split("T")[0].replace(/-/g, "");
    let sufijo = "A";
    let idAssignment = `A${fecha}${sufijo}`;

    try {
      let assignmentExistente = await this.constructor.findOne({ idAssignment });

      while (assignmentExistente) {
        sufijo = String.fromCharCode(sufijo.charCodeAt(0) + 1);
        idAssignment = `A${fecha}${sufijo}`;
        assignmentExistente = await this.constructor.findOne({ idAssignment });
      }

      this.idAssignment = idAssignment;
    } catch (err) {
      console.error("Error al generar idAssignment:", err);
      return next(err);
    }
  }
  next();
});

export default mongoose.model('Assignment', assignmentSchema);
