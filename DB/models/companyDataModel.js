import { model, Schema } from "mongoose";

export const companyDataSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        minlength: 2,
    },
    logo: {
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
    email: {
        type: String,
        required: true,
    },
    phoneNum: {
        type: String,
        required: true,
        minlength: 4,
    },
    // landLine: {
    //     type: String,
    //     minlength: 4,
    //     // maxlength: 15
    // },
    address:{
        type:String,
        required:true,
    },
    location: {
        type: String,
        required:true
    },
    metaDesc:{
        type:String,
        // required: true,
    },
    metaKeyWords:{
        type:String,
    },
    Facebook: String,
    Instagram: String,
    Twitter: String,
    WhatsApp: String,
    

    // slogan:{
    //     type:String,
    //     required:true
    // },
    // contactUsImage: {
    //     secure_url: {
    //         type: String,
    //         required: true
    //     },
    //     public_id: {
    //         type: String,
    //         required: true
    //     },
    //     alt:{
    //         type:String,
    //         required: true
    //     },
    //     customId:String,
    // },
},
    { timestamps: true })

export const companyDataModel = model('companyData', companyDataSchema)