import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        type: {
            type: String,
            enum: ['Rendez-vous reminder', 'Consultation link', 'Rendez-vous canceled'],
            required: true,
        },
        text:{
            type: String,
            required: true,
        },
        isSeen: {
            type: Boolean,
            required: true,
            default:false
        },
    }, 
    {
        timestamps: true 
    });

  export default model("Notification",notificationSchema );