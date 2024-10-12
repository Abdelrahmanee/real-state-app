import { model, Schema } from "mongoose";

export const blogSchema = new Schema({
    title: {
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
    date: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    
},
    { timestamps: true })

export const blogModel = model('blog', blogSchema)