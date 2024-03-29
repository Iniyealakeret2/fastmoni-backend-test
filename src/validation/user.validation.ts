import { Joi, Segments } from "celebrate";

import { UserType } from "../typings/user";
import { DonationQueryParams, DonationQueryValidationType } from "../typings/donations";

/**
 * Object representing the Validation check for app User HTTP requests
 * @description Validate user inputs on both POST, PUT, UPDATE and PATCH request
 */

export default {
  /**
   * @description Validate create pin inputs
   * @param {body} req - Request property object gotten from the request
   * @property {account_pin} body.account_pin - User account_pin
   * @property {id} param.id - User id
   * @returns {Partial<UserType>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  createAccountPin: {
    [Segments.PARAMS]: Joi.object<{ id: string }>({
      id: Joi.string().required(),
    }),

    [Segments.BODY]: Joi.object<Pick<UserType, "account_pin">>().keys({
      account_pin: Joi.number()
        .integer()
        .min(1000)
        .max(9999)
        .rule({ message: "PIN must be 4 digits" }),
    }),
  },

  /**
   * @description Validate user update inputs
   * @param {body} req - Request property object gotten from the request
   * @property {account_pin} body.account_pin - User account_pin
   * @property {id} param.id - User id
   * @returns {Partial<UserType>} {Partial<UserInterface>} Returns the Request object after validating user inputs from req.body
   */
  donateAmount: {
    [Segments.PARAMS]: Joi.object<{ id: string }>({
      id: Joi.string().required(),
    }),

    [Segments.BODY]: Joi.object<{
      pin: number;
      wallet_number: number;
      amount_donated: number;
    }>().keys({
      pin: Joi.number().integer().min(1000).max(9999).rule({ message: "PIN must be 4 digits" }),

      amount_donated: Joi.number().min(10).required(),

      wallet_number: Joi.number()
        .integer()
        .min(1000000000)
        .max(9999999999)
        .rule({ message: "Account must be 10 Digits" }),
    }),
  },

  /**
   * @description Validate getting donations by date inputs
   * @param {query} req - Request property object gotten from the request
   * @property {id} body.id - challenge id
   * @returns {ClientInterface} {ClientInterface} Returns the Request object after validating get all client inputs from req.query and req.params
   */
  dateQuery: {
    [Segments.QUERY]: Joi.object<Pick<DonationQueryParams, "startDate" | "endDate">>({
      endDate: Joi.date(),

      startDate: Joi.date(),
    }),
  },

  /**
   * @description Validate getting a all clients inputs
   * @param {query} req - Request property object gotten from the request
   * @property {id} body.id - challenge id
   * @returns {ClientInterface} {ClientInterface} Returns the Request object after validating get all client inputs from req.query and req.params
   */
  getQuery: {
    [Segments.QUERY]: Joi.object<Pick<DonationQueryValidationType, "page" | "limit">>({
      page: Joi.number().default(1),

      limit: Joi.number().default(10),
    }),
  },

  /**
   * @description Validate id params
   * @param {param} req - Request property object gotten from the request
   * @returns {Partial<PostInterface>} {Partial<PostInterface>} Returns the Request object after validating join challenge inputs from req.body
   */
  idParam: {
    [Segments.PARAMS]: Joi.object<{ id: string }>({
      id: Joi.string().required(),
    }),
  },
};
