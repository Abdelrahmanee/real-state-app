import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandeling.js";
import * as viewsController from './view.controller.js'
const router = Router()

router.post('/newVisitor',
    asyncHandler(viewsController.newVisitor)
)
export default router