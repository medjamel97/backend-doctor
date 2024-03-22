import { Schema, model } from "mongoose";

const patientSchema = new Schema({
    fName: {type: String, required: true},
    lName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String},
    phoneNbr: {type: Number},
    birthDate: {type: Date},
    medecin: {type: Schema.Types.ObjectId, ref: 'Medecin', default : null},
    rendez_vous: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Appointment' 
        }
    ],
    medicalFolder: {
         type: Schema.Types.ObjectId, 
         ref: 'MedicalFolder' 
    },
  });

  export default model("Patient",patientSchema);