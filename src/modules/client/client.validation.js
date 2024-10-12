import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addClientSchema = {
    body: joi.object({
        name: joi.string().min(3).required(),
        altImage: joi.string().min(3).required(),
    }).required()
}

export const editClientSchema = {
    params: joi.object({
        clientId:generalFields._id.required(),
    }).required(),
    body: joi.object({
        name: joi.string().min(3),
        altImage: joi.string().min(3),
    }).required()
}

export const deleteClientSchema = {
    params: joi.object({
        clientId:generalFields._id.required(),
    }).required(),
}
