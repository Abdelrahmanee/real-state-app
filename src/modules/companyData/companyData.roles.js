import { systemRoles } from '../../utils/systemRoles.js';

export const companyApisRoles = {
    ADD_COMPANYDATA:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_COMPANYDATA:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_COMPANYDATA:[systemRoles.ADMIN,systemRoles.EDITOR],
}