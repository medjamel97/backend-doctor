import {model, Schema} from "mongoose";

const medecinSchema = new Schema({
    fName: {type: String, required: true},
    lName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String},
    phoneNbr: {type: Number},
    specialization: {type: String},
    yearsOfExperience: {type: Number},
    patients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Patient'
        }
    ],
    render_vous: [
        {
            type: Schema.Types.ObjectId,
            ref: 'RendezVous'
        }
    ],
});

export default model("Medecin", medecinSchema);