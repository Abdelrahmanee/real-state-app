import { Router } from "express";
import * as blogControllers from './blog.controller.js'
import * as blogValidators from './blog.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";
import { blogApisRoles } from "./blog.roles.js";
const router = Router()

router.post('/add',
    // isAuth(blogApisRoles.ADD_BLOG),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(blogValidators.addBlogSchema),
    asyncHandler(blogControllers.addBlog)
)

router.put('/edit/:blogId',
    // isAuth(blogApisRoles.EDIT_BLOG),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(blogValidators.editBlogSchema),
    asyncHandler(blogControllers.editBlog)
)

router.delete('/delete/:blogId',
    // isAuth(blogApisRoles.DELETE_BLOG),
    validationCoreFunction(blogValidators.deleteBlogSchema),
    asyncHandler(blogControllers.deleteBlog)
)

router.get('/get',
    // isAuth(blogApisRoles.GET_BLOGS),
    asyncHandler(blogControllers.getBlogs)
)

export default router