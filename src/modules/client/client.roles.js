import { systemRoles } from '../../utils/systemRoles.js';

export const clientApisRoles = {
    ADD_CLIENT:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_CLIENT:[systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_CLIENT:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_CLIENTS:[systemRoles.ADMIN,systemRoles.EDITOR],
}