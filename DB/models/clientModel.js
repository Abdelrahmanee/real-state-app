import { model, Schema } from "mongoose";

export const clientSchema = new Schema({
    name: {
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
},
    { timestamps: true })

export const clientModel = model('client', clientSchema)