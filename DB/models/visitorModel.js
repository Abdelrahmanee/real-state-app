import { model, Schema } from "mongoose";

const visitorSchema = new Schema(
    {
        IP:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const visitorModel = model('visitor',visitorSchema)