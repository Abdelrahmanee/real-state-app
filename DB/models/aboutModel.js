import { model, Schema } from "mongoose";

export const aboutSchema = new Schema({
    titleHome: {
        type: String,
        required: true,
        minlength: 2,
    },
    titleAbout: {
        type: String,
        required: true,
        minlength: 2,
    },
    description:{
        type:String,
        required: true,
    },
    mission:{
        type:String,
        required: true,
    },
    vision:{
        type:String,
        required: true,
    },
    imageHome: {
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
    imageAbout: {
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

export const aboutModel = model('about', aboutSchema)