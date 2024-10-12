import { systemRoles } from './../../utils/systemRoles.js';

export const adminApisRoles = {
    CHANGE_PASSWORD:[systemRoles.ADMIN],
    ADD_ACCOUNT:[systemRoles.ADMIN],
    DELETE_ACCOUNT:[systemRoles.ADMIN],
    CHANGE_ROLE:[systemRoles.ADMIN],
    LOGOUT:[systemRoles.ADMIN,systemRoles.CUSTOMER_SERVICE,systemRoles.EDITOR]
}