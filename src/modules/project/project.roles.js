import { systemRoles } from '../../utils/systemRoles.js';

export const projectApisRoles = {
    ADD_PROJECT:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_PROJECT:[systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_PROJECT:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_PROJECTS:[systemRoles.ADMIN,systemRoles.EDITOR],
    ADD_PROJECT_IMAGES:[systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_PROJECT_IMAGES:[systemRoles.ADMIN,systemRoles.EDITOR],

}