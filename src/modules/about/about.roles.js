import { systemRoles } from '../../utils/systemRoles.js';

export const aboutApisRoles = {
    ADD_ABOUT:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_ABOUT:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_ABOUT:[systemRoles.ADMIN,systemRoles.EDITOR],
}