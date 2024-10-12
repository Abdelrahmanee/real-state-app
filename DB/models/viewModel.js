import { model, Schema } from "mongoose";

const viewSchema = new Schema(
    {
        visitorId:{
            type:Schema.Types.ObjectId,
            ref:'visitor',
            required:true
        },
        projectId:{
            type:Schema.Types.ObjectId,
            ref:'project',
            required:true
        },
    },
    {
        timestamps:true
    }
)

export const viewModel = model('view',viewSchema)