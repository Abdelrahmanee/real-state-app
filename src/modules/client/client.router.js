import { Router } from "express";
import * as clientControllers from './client.controller.js'
import * as clientValidators from './client.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { clientApisRoles } from "./client.roles.js";
const router = Router()

router.post('/add',
    // isAuth(clientApisRoles.ADD_CLIENT),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(clientValidators.addClientSchema),
    asyncHandler(clientControllers.addClient)
)

router.put('/edit/:clientId',
    // isAuth(clientApisRoles.EDIT_CLIENT),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(clientValidators.editClientSchema),
    asyncHandler(clientControllers.editClient)
)

router.delete('/delete/:clientId',
    // isAuth(clientApisRoles.DELETE_CLIENT),
    validationCoreFunction(clientValidators.deleteClientSchema),
    asyncHandler(clientControllers.deleteClient)
)

router.get('/get',
    // isAuth(clientApisRoles.GET_CLIENTS),
    asyncHandler(clientControllers.getClients)
)

export default router