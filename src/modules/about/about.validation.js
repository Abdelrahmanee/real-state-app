import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addAboutSchema = {
    body: joi.object({
        titleHome: joi.string().min(3).required(),
        titleAbout: joi.string().min(3).required(),
        description: joi.string().required(),
        mission: joi.string().required(),
        vision: joi.string().required(),
        altHome: joi.string().min(3).required(),
        altAbout: joi.string().min(3).required(),
    }).required()
}

export const editAboutSchema = {
    body: joi.object({
        titleHome: joi.string().min(3).required(),
        titleAbout: joi.string().min(3).required(),
        description: joi.string().required(),
        mission: joi.string().required(),
        vision: joi.string().required(),
        altHome: joi.string().min(3).required(),
        altAbout: joi.string().min(3).required(),
    }).required()
}