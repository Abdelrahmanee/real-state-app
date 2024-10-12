import { Router } from "express";
import * as adminAuthController from './admin.controller.js';
import * as adminAuthValidators from './admin.validation.js';
import { isAuth } from "../../middlewares/auth.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import { adminApisRoles } from "./apiRoles.js";

const router = Router()
router.post('/signUp',
    validationCoreFunction(adminAuthValidators.signUpSchema),
    asyncHandler(adminAuthController.adminSignUp),
)

router.put('/verifyEmail',
    asyncHandler(adminAuthController.verifyEmail),
)

router.post('/signIn',
    validationCoreFunction(adminAuthValidators.signInSchema),
    asyncHandler(adminAuthController.signIn),
)

router.get('/resendVerificationCode/:adminId',
    validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(adminAuthController.resendVerificationCode),
)

router.get('/resendForgetCode/:adminId',
    validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(adminAuthController.resendForgetCode),
)

router.post('/forget',
    validationCoreFunction(adminAuthValidators.forgetPassSchema),
    asyncHandler(adminAuthController.forgetPassword),
)

router.patch('/reset',
    validationCoreFunction(adminAuthValidators.resetPassSchema),
    asyncHandler(adminAuthController.resetPassword),
)

router.patch('/changePassword',
    // isAuth(adminApisRoles.CHANGE_PASSWORD),
    validationCoreFunction(adminAuthValidators.changePassSchema),
    asyncHandler(adminAuthController.changePassword),
)

router.patch('/logOut',
    // isAuth(adminApisRoles.LOGOUT),
    validationCoreFunction(adminAuthValidators.adminSignUp),
    asyncHandler(adminAuthController.logOut),
)

router.post('/addAccount',
    // isAuth(adminApisRoles.ADD_ACCOUNT),
    validationCoreFunction(adminAuthValidators.addAccountSchema),
    asyncHandler(adminAuthController.addAccount),
)

router.delete('/deleteAccount',
    // isAuth(adminApisRoles.DELETE_ACCOUNT),
    validationCoreFunction(adminAuthValidators.deleteAccountSchema),
    asyncHandler(adminAuthController.deleteAccount),
)

router.patch('/changeRole',
    // isAuth(adminApisRoles.CHANGE_ROLE),
    validationCoreFunction(adminAuthValidators.changeRoleSchema),
    asyncHandler(adminAuthController.changeRole),
)
export default router