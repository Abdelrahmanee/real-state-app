import { Router } from "express";
import * as specializationControllers from './specialization.controller.js'
import * as specializationValidators from './specialization.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { specializationApisRoles } from "./specialization.roles.js";
const router = Router()

router.post('/add',
    // isAuth(specializationApisRoles.ADD_SPECIALIZATION),
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(specializationValidators.addSpecializationSchema),
    asyncHandler(specializationControllers.addSpecialization)
)

router.put('/edit/:specializationId',
    // isAuth(specializationApisRoles.EDIT_SPECIALIZATION),
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(specializationValidators.editSpecializationSchema),
    asyncHandler(specializationControllers.editSpecialization)
)

router.delete('/delete/:specializationId',
    // isAuth(specializationApisRoles.DELETE_SPECIALIZATION),
    validationCoreFunction(specializationValidators.deleteSpecializationSchema),
    asyncHandler(specializationControllers.deleteSpecialization)
)

router.get('/get',
    // isAuth(specializationApisRoles.GET_SPECIALIZATIONS),
    asyncHandler(specializationControllers.getSpecializations)
)

export default router