import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addHeroImageSchema = {
    body: joi.object({
        title: joi.string().min(3).required(),
        type: joi.string().min(2).required(),
        altImage: joi.string().min(2).required(),
        projectId:generalFields._id,
        blogId:generalFields._id,
    }).required()
}

export const editHeroImageSchema = {
    params: joi.object({
        heroImageId:generalFields._id.required(),
    }).required(),
    body: joi.object({
        title: joi.string().min(3),
        type: joi.string().min(2),
        altImage: joi.string().min(2),
        projectId:generalFields._id,
        blogId:generalFields._id,
    }).required()
}

export const deleteHeroImageSchema = {
    params: joi.object({
        heroImageId:generalFields._id.required(),
    }).required(),
}
