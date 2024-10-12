import { systemRoles } from '../../utils/systemRoles.js';

export const testimonialApisRoles = {
    ADD_TESTIMONIAL:[systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_TESTIMONIAL:[systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_TESTIMONIAL:[systemRoles.ADMIN,systemRoles.EDITOR],
    GET_TESTIMONIALS:[systemRoles.ADMIN,systemRoles.EDITOR],
}