import { Router } from "express";
import * as companyController from './companyData.controller.js'
import * as companyValidators from './companyData.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { companyApisRoles } from "./companyData.roles.js";
const router = Router()

router.post('/add',
    // isAuth(companyApisRoles.ADD_COMPANYDATA),
    multerCloudFunction(allowedExtensions.Image).single('logo'),
    convertToWebP,
    validationCoreFunction(companyValidators.addCompanySchema),
    asyncHandler(companyController.addCompanyData)
)

router.put('/edit',
    // isAuth(companyApisRoles.EDIT_COMPANYDATA),
    multerCloudFunction(allowedExtensions.Image).single('logo'),
    convertToWebP,
    validationCoreFunction(companyValidators.editCompanySchema),
    asyncHandler(companyController.editCompanyData)
)

router.get('/get',
    // isAuth(companyApisRoles.GET_COMPANYDATA),
    asyncHandler(companyController.getCompany)
)

export default router