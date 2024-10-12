import { model, Schema } from "mongoose";

export const specializationSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        customId: String,
    },
},
    { timestamps: true })

export const specializationModel = model('specialization', specializationSchema)