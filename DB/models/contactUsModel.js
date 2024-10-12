import { model, Schema } from "mongoose";

export const contactUsSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNum: {
        type: String,
        required: true,
        minlength: 4,
    },
    message:{
        type:String,
    },
},
    { timestamps: true })

export const contactUsModel = model('contactUs', contactUsSchema)