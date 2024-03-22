import {model, Schema} from "mongoose";

const rendezVousSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    isOnline: {
        type: Boolean,
        required: true
    },
    isValidated: {
        type: Boolean,
        required: true,
        default: false
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    medecin: {
        type: Schema.Types.ObjectId,
        ref: 'Medecin',
        required: true
    },
});

export default model("RendezVous", rendezVousSchema);