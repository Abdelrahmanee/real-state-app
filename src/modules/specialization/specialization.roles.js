import { systemRoles } from '../../utils/systemRoles.js';

export const specializationApisRoles = {
    ADD_SPECIALIZATION:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_SPECIALIZATION:[systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_SPECIALIZATION:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_SPECIALIZATIONS:[systemRoles.ADMIN,systemRoles.EDITOR],
}