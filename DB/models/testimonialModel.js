import { model, Schema } from "mongoose";

export const testimonialSchema = new Schema({
    review: {
        type: String,
        required: true,
        minlength: 2,
    },
    image: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        alt:{
            type:String,
            required: true
        },
        customId:String,
    },
    name: {
        type: String,
        required: true,
    },
    position:{
        type: String,
        required: true,
    },
    
},
    { timestamps: true })

export const testimonialModel = model('testimonial', testimonialSchema)