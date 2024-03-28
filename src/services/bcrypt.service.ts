import bcrypt from "bcryptjs";
import config from "../config";
import { BcryptServiceInterface } from "../typings/services";

/**
 *
 * @class BcryptService
 * @extends BcryptServiceInterface
 * @classdesc Class representing user password encryption and decryption service
 * @description User password encryption and decryption service class
 * @name ErrorService
 * @exports BcryptServiceInterface
 */

export default class BcryptService extends BcryptServiceInterface {
  /**
   * @method hashPassword
   * @param {string} password - user registration password
   * @returns {Promise<string>} Returns the signed encrypted user password
   */
  public static hashPassword = async (password: string): Promise<string> => {
    const salt = bcrypt.genSaltSync(Number(config.BCRYPT_ROUND));
    return bcrypt.hash(password, salt);
  };

  /**
   * @method comparePassword
   * @param {string} password - user registered password
   * @param {string} hash - user encrypted registration password
   * @returns {boolean} Returns boolean if the both the registration password and encrypted password matches after decrypting it
   */
  public static comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  };
}
