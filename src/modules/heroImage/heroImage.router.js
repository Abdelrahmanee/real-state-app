import { Router } from "express";
import * as heroImageControllers from './heroImage.controller.js'
import * as heroImageValidators from './heroImage.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { heroApisRoles } from "./hero.roles.js";
const router = Router()

router.post('/add',
    // isAuth(heroApisRoles.ADD_HEROIMAGE),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(heroImageValidators.addHeroImageSchema),
    asyncHandler(heroImageControllers.addHeroImage)
)

router.put('/edit/:heroImageId',
    // isAuth(heroApisRoles.EDIT_HEROIMAGE),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(heroImageValidators.editHeroImageSchema),
    asyncHandler(heroImageControllers.editHeroImage)
)

router.delete('/delete/:heroImageId',
    // isAuth(heroApisRoles.DELETE_HEROIMAGE),
    validationCoreFunction(heroImageValidators.deleteHeroImageSchema),
    asyncHandler(heroImageControllers.deleteHeroImage)
)

router.get('/get',
    // isAuth(heroApisRoles.GET_HEROIMAGES),
    asyncHandler(heroImageControllers.getHeroImages)
)

export default router