import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addSpecializationSchema = {
    body: joi.object({
        title: joi.string().min(3).required(),
        description: joi.string().min(2).required(),
        altIcon: joi.string().min(3).required(),
    }).required()
}

export const editSpecializationSchema = {
    params: joi.object({
        specializationId:generalFields._id.required(),
    }).required(),
    body: joi.object({
        title: joi.string().min(3),
        description: joi.string().min(2),
        altIcon: joi.string().min(3),
    }).required()
}

export const deleteSpecializationSchema = {
    params: joi.object({
        specializationId:generalFields._id.required(),
    }).required(),
}
