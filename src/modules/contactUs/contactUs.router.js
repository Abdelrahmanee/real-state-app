import { Router } from "express"
import * as contactController from './contactUs.controller.js'
import * as contactValidators from './contactUs.validation.js'
import { asyncHandler } from "../../utils/errorHandeling.js"
import { validationCoreFunction } from "../../middlewares/validation.js"
import { isAuth } from "../../middlewares/auth.js"
import { contactApisRoles } from "./contact.roles.js"
const router = Router()

router.post('/send',
    validationCoreFunction(contactValidators.contactSchema),
    asyncHandler(contactController.contact)
)


router.get('/get',
    // isAuth(contactApisRoles.GET_CONTACTS),
    asyncHandler(contactController.getContactUsers)
)

export default router
