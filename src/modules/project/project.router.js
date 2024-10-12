import { Router } from "express";
import * as projectControllers from './project.controller.js'
import * as projectValidators from './project.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { projectApisRoles } from "./project.roles.js";
const router = Router()

router.post('/add',
    // isAuth(projectApisRoles.ADD_PROJECT),
    multerCloudFunction(allowedExtensions.Image).single('mainImage'),
    convertToWebP,
    validationCoreFunction(projectValidators.addProjectSchema),
    asyncHandler(projectControllers.addProject)
)

router.put('/edit/:projectId',
    // isAuth(projectApisRoles.EDIT_PROJECT),
    multerCloudFunction(allowedExtensions.Image).single('mainImage'),
    convertToWebP,
    validationCoreFunction(projectValidators.editProjectSchema),
    asyncHandler(projectControllers.editProject)
)

router.delete('/delete/:projectId',
    // isAuth(projectApisRoles.DELETE_PROJECT),
    validationCoreFunction(projectValidators.deleteProjectSchema),
    asyncHandler(projectControllers.deleteProject)
)

router.get('/get',
    // isAuth(projectApisRoles.GET_PROJECTS),
    asyncHandler(projectControllers.getProjects)
)

router.post('/addImages',
    // isAuth(projectApisRoles.ADD_PROJECT_IMAGES),
    multerCloudFunction(allowedExtensions.Image).array('images', 4),
    convertToWebP,
    validationCoreFunction(projectValidators.addProjectImagesSchema),
    asyncHandler(projectControllers.addProjectImages)
)

router.delete('/deleteImage/:imageId',
    // isAuth(projectApisRoles.DELETE_PROJECT_IMAGES),
    validationCoreFunction(projectValidators.deleteProjectImageSchema),
    asyncHandler(projectControllers.deleteProjectImage)
)
export default router