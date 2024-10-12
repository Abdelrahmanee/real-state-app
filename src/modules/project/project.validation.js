import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addProjectSchema = {
    body: joi.object({
        name: joi.string().min(3).required(),
        clientId: generalFields._id.required(),
        status: joi.string().min(2).required(),
        location: joi.string().min(3).required(),
        details: joi.string().min(3).required(),
        date:joi.date().required(),
        altImage: joi.string().min(3).required(),
    }).required()
}

export const editProjectSchema = {
    params: joi.object({
        projectId:generalFields._id.required(),
    }).required(),
    body: joi.object({
        name: joi.string().min(3),
        clientId: generalFields._id,
        status: joi.string().min(2),
        location: joi.string().min(3),
        details: joi.string().min(3),
        date:joi.date(),
        altImage: joi.string().min(3),
    }).required()
}

export const deleteProjectSchema = {
    params: joi.object({
        projectId:generalFields._id.required(),
    }).required(),
}

export const addProjectImagesSchema = {
    body: joi.object({
        projectId:generalFields._id.required(),        
        altImage: joi.string().min(3).required(),
    }).required()
}

export const deleteProjectImageSchema = {
    params: joi.object({
        imageId:generalFields._id.required(),
    }).required(),
}