import {model, Schema} from "mongoose";


const dossierMedicalSchema = new Schema({
    sex: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    dossierNumber: {type: String, required: true},
    alertData: {type: String},
    personalAndFamilyHistory: {type: String},
    prescription: {type: String},
    patient: {type: Schema.Types.ObjectId, ref: 'Patient'},
    notes: [{type: String}],
});

export default model("DossierMedical", dossierMedicalSchema);
  