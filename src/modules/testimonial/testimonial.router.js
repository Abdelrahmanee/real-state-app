import { Router } from "express";
import * as testimonialControllers from './testimonial.controller.js'
import * as testimonialValidators from './testimonial.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { testimonialApisRoles } from "./testimonial.roles.js";
const router = Router()

router.post('/add',
    // isAuth(testimonialApisRoles.ADD_TESTIMONIAL),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(testimonialValidators.addTestimonialSchema),
    asyncHandler(testimonialControllers.addTestimonial)
)

router.put('/edit/:testimonialId',
    // isAuth(testimonialApisRoles.EDIT_TESTIMONIAL),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(testimonialValidators.editTestimonialSchema),
    asyncHandler(testimonialControllers.editTestimonial)
)

router.delete('/delete/:testimonialId',
    // isAuth(testimonialApisRoles.DELETE_TESTIMONIAL),
    validationCoreFunction(testimonialValidators.deleteTestimonialSchema),
    asyncHandler(testimonialControllers.deleteTestimonial)
)

router.get('/get',
    // isAuth(testimonialApisRoles.GET_TESTIMONIALS),
    asyncHandler(testimonialControllers.getTestimonial)
)

export default router