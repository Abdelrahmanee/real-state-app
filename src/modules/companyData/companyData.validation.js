import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addCompanySchema = {
    body: joi.object({
        companyName: joi.string().min(3).required(),
        email: generalFields.email.required(),
        phoneNum: joi.string().required(),
        location: joi.string().uri().required(),
        address: joi.string().min(3).required(),
        altLogo: joi.string().min(3).required(),
        Facebook: joi.string().uri(),
        Instagram: joi.string().uri(),
        Twitter: joi.string().uri(),
        WhatsApp: joi.string().uri(),
        metaDesc: joi.string().min(3),
        metaKeyWords: joi.string().min(3),
    }).required()
}

export const editCompanySchema = {
    body: joi.object({
        companyName: joi.string().min(3),
        email: generalFields.email,
        phoneNum: joi.string(),
        location: joi.string().uri(),
        Facebook: joi.string().uri(),
        Instagram: joi.string().uri(),
        Twitter: joi.string().uri(),
        WhatsApp: joi.string().uri(),
        metaDesc: joi.string().min(3),
        metaKeyWords: joi.string().min(3),
        altLogo: joi.string().min(3),
        address: joi.string().min(3),
    }).required()
}