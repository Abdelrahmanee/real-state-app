import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addBlogSchema = {
    body: joi.object({
        title: joi.string().min(3).required(),
        description: joi.string().min(2).required(),
        date:joi.date().required(),
        altImage: joi.string().min(3).required(),
    }).required()
}

export const editBlogSchema = {
    params: joi.object({
        blogId:generalFields._id.required(),
    }).required(),
    body: joi.object({
        title: joi.string().min(3),
        description: joi.string().min(2),
        date:joi.date(),
        altImage: joi.string().min(3),
    }).required()
}

export const deleteBlogSchema = {
    params: joi.object({
        blogId:generalFields._id.required(),
    }).required(),
}
