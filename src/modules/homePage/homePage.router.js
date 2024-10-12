import { Router } from "express";
import * as homePageControllers from './homePage.controller.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
const router = Router()


router.get('/getHome',
    asyncHandler(homePageControllers.getHomeData)
)

router.get('/getProjects',
    asyncHandler(homePageControllers.getProjects)
)

router.get('/getBlogs',
    asyncHandler(homePageControllers.getBlogs)
)

router.get('/getProject/:projectId',
    asyncHandler(homePageControllers.getProject)
)

router.get('/getBlog/:blogId',
    asyncHandler(homePageControllers.getBlog)
)

router.get('/getAbout',
    asyncHandler(homePageControllers.getAboutData)
)

router.get('/getClientProjects/:clientId',
    asyncHandler(homePageControllers.getClientProjects)
)
export default router
