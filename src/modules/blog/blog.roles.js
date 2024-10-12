import { systemRoles } from '../../utils/systemRoles.js';

export const blogApisRoles = {
    ADD_BLOG:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_BLOG:[systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_BLOG:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_BLOGS:[systemRoles.ADMIN,systemRoles.EDITOR],
}