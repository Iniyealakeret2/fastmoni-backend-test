import { Joi, Segments } from "celebrate";
import { UserType } from "../typings/user";

/**
 * Object representing the Validation check for app auth HTTP requests
 * @description Validate user inputs on both POST, PUT, UPDATE and PATCH request
 */

export default {
  /**
   * @description Validate user signup inputs
   * @param {body} req - Request property object gotten from the request
   * @property {password} body.password - User password
   * @property {email_address} body.email - User email address
   * @property {full_name} body.full_name - User full_name
   * @returns {Partial<UserType>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  signup: {
    [Segments.BODY]: Joi.object<Pick<UserType, "email" | "password" | "full_name">>().keys({
      email: Joi.string().min(6).max(255).required(),

      password: Joi.string().min(6).max(255).required(),

      full_name: Joi.string().min(6).max(255).required(),
    }),
  },

  /**
   * @description Validate user signin inputs
   * @param {body} req - Request property object gotten from the request
   * @property {password} body.password - User password
   * @property {email_address} body.email - User email address
   * @returns {Partial<UserType>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  signin: {
    [Segments.BODY]: Joi.object<Pick<UserType, "email" | "password">>().keys({
      email: Joi.string().email(),

      password: Joi.string().required(),
    }),
  },

  /**
   * @description Validate user verify otp inputs
   * @param {body} req - Request property object gotten from the request
   * @property {otp} body.otp - User otp
   * @property {email_address} body.email - User email_address
   * @returns {Partial<UserType>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  verifyOtp: {
    [Segments.BODY]: Joi.object<Pick<UserType, "email"> & { otp: string }>().keys({
      otp: Joi.string().required(),

      email: Joi.string().required(),
    }),
  },
};
