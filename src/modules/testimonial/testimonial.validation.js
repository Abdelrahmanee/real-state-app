import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addTestimonialSchema = {
    body: joi.object({
        name: joi.string().min(3).required(),
        position: joi.string().min(2).required(),
        review: joi.string().min(3).required(),
        altImage: joi.string().min(3).required(),
    }).required()
}

export const editTestimonialSchema = {
    params: joi.object({
        testimonialId:generalFields._id.required(),
    }).required(),
    body: joi.object({
        name: joi.string().min(3),
        position: joi.string().min(2),
        review: joi.string().min(3),
        altImage: joi.string().min(3),
    }).required()
}

export const deleteTestimonialSchema = {
    params: joi.object({
        testimonialId:generalFields._id.required(),
    }).required(),
}
