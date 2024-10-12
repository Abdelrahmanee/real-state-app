import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"
export const contactSchema = {
    body: joi.object({
        name: joi.string().min(3).required(),
        email: generalFields.email.required(),
        phoneNum: generalFields.phoneNumbers.required(),
        message: joi.string().min(3),
    }).required()
}

