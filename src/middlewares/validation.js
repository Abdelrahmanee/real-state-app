import { Types } from "mongoose"
import joi from 'joi'
const validationIdSchema = (value,helper)=>
{
  return Types.ObjectId.isValid(value)?true:helper.message('invalid id')
}
export const generalFields = {
  email: joi
    .string()
    .email()
    ,
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      'string.pattern.base': 'Password regex fail',
    }),
    _id : joi.string().custom(validationIdSchema),
    phoneNumbers: joi
    .string()
    .regex(/^01[0125][0-9]{8}$/),
    time:joi
    .string()
    .regex(/^[0-9]{2}:[0-9]{2}(pm|am)$/)
}
const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files']
export const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    const validationErrorArr = []
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,  // 3ashan validate bt5rog mn first error
        }) 
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details[0].message)
        }
      }
    }
    if (validationErrorArr.length) {
      req.validationErrorArr = validationErrorArr;
      return next(new Error('',{cause:400}))
    }
    next()
  }
}