import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import config from "../config";
import { UserType } from "../typings/user";
import { AuthServiceInterface } from "../typings/auth";

/**
 *
 * @class AuthService
 * @extends AuthServiceInterface
 * @classdesc Class representing the auth service
 * @description User authentication service class
 * @name ErrorService
 * @exports AuthServiceInterface
 */

export default class AuthService extends AuthServiceInterface {
  /**
   * @method issueAccessToken
   * @param {Partial<UserType>} payload - user payload object
   * @returns {Promise<string>} Returns the signed encrypted user issued object as string
   */
  public static issueAccessToken = ({ id, email }: Partial<UserType>): Promise<string> => {
    return new Promise((resolve, reject) =>
      jwt.sign(
        { email },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXPIRY, issuer: "fastmoni.com", audience: id },
        (error, access_token) => {
          if (error) return reject(error);
          return resolve(`Bearer ${access_token!!}`);
        }
      )
    );
  };

  /**
   * @method issueRefreshToken
   * @param {Partial<UserType>} payload - user payload object
   * @returns {Promise<string>} Returns the a newly signed encrypted user issued object as string
   */
  public static issueRefreshToken = ({ id, email }: Partial<UserType>): Promise<string> => {
    return new Promise((resolve, reject) =>
      jwt.sign(
        { email },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: config.REFRESH_TOKEN_EXPIRY, issuer: "fastmoni.com", audience: id },
        (error, refresh_token) => {
          if (error) return reject(error);
          resolve(`Bearer ${refresh_token!!}`);
        }
      )
    );
  };

  /**
   * @method verifyAccessToken
   * @param {string} access_token - user token issued string
   * @returns {Promise<JwtPayload | undefined>} Returns the verified decrypted user issued object
   */
  public static verifyAccessToken = (access_token: string): Promise<JwtPayload | undefined> => {
    return new Promise((resolve, reject) =>
      jwt.verify(
        access_token,
        config.ACCESS_TOKEN_SECRET,
        (error: VerifyErrors | null, decoded) => {
          if (error) return reject(error);
          return resolve(decoded as JwtPayload);
        }
      )
    );
  };

  /**
   * @method verifyRefreshToken
   * @param {string} refresh_token - user refresh token issued string
   * @returns {Promise<JwtPayload | undefined>} Returns the verified decrypted user issued object
   */
  public static verifyRefreshToken = (refresh_token: string): Promise<JwtPayload | undefined> => {
    return new Promise((resolve, reject) =>
      jwt.verify(
        refresh_token,
        config.REFRESH_TOKEN_SECRET,
        (error: VerifyErrors | null, decoded: Object | undefined) => {
          if (error) return reject(error);
          return resolve(decoded!!);
        }
      )
    );
  };
}
