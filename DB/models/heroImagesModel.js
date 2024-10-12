import { model, Schema } from "mongoose";

export const heroImageSchema = new Schema({
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
    type: {
        type: String,
        required: true,
    },
    projectId:{
        type:Schema.Types.ObjectId,
        ref:'project'
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    }
    
},
    { timestamps: true })

export const heroImageModel = model('heroImage', heroImageSchema)