import { Router } from "express";
import * as aboutController from './about.controller.js'
import * as aboutValidators from './about.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { aboutApisRoles } from './about.roles.js';
const router = Router()

router.post('/add',
    // isAuth(aboutApisRoles.ADD_ABOUT),
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'imageHome', maxCount: 1 },
        { name: 'imageAbout', maxCount: 1 },
    ]),
    convertToWebP,
    validationCoreFunction(aboutValidators.addAboutSchema),
    asyncHandler(aboutController.addAbout)
)

router.put('/edit',
    // isAuth(aboutApisRoles.EDIT_ABOUT),
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'imageHome', maxCount: 1 },
        { name: 'imageAbout', maxCount: 1 },
    ]),
    convertToWebP,
    validationCoreFunction(aboutValidators.editAboutSchema),
    asyncHandler(aboutController.editAbout)
)

router.get('/get',
    // isAuth(aboutApisRoles.GET_ABOUT),
    asyncHandler(aboutController.getAbout)
)

export default router