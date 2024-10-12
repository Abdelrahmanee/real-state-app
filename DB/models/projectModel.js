import { model, Schema } from "mongoose";

export const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
        },
        mainImage: {
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
        date: {
            type: String,
            required: true,
        },
        clientId: {
            type:Schema.Types.ObjectId,
            ref:'client',
            required:true
        },
        status: {
            type: String,
            // required:true,
        },
        location: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true,
        },
        projectFolder:String
    },
    {
        timestamps: true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)
projectSchema.virtual('images',{
    ref:'projectImage',
    localField:'_id',
    foreignField:'projectId'
})

export const projectModel = model('project', projectSchema)