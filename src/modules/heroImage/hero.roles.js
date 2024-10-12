import { systemRoles } from '../../utils/systemRoles.js';

export const heroApisRoles = {
    ADD_HEROIMAGE:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_HEROIMAGE:[systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_HEROIMAGE:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_HEROIMAGES:[systemRoles.ADMIN,systemRoles.EDITOR],
}