import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { ExpressResponseInterface } from "./helpers";
import { UserType } from "./user";

export abstract class AuthControllerInterface {
  /**
   * @async
   * @method signup
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof AuthControllerInterface
   */
  public static signup: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method signin
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof AuthControllerInterface
   */
  public static signin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method verifyOtp
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof AuthControllerInterface
   */
  public static verifyOtp: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;
}

export abstract class AuthServiceInterface {
  /**
   * @method issueAccessToken
   * @param {UserInterface} payload
   * @returns {Promise<string>}
   */
  public static issueAccessToken: (payload: UserType) => Promise<string>;

  /**
   * @method issueRefreshToken
   * @param { UserInterface} payload
   * @returns {Promise<string>}
   */
  public static issueRefreshToken: (payload: UserType) => Promise<string>;

  /**
   * @method verifyAccessToken
   * @param {string} access_token
   * @returns {Promise<JwtPayload | undefined>}
   */
  public static verifyAccessToken: (access_token: string) => Promise<JwtPayload | undefined>;

  /**
   * @method verifyRefreshToken
   * @param {string} refresh_token
   * @returns {Promise<JwtPayload | undefined>}
   */
  public static verifyRefreshToken: (refresh_token: string) => Promise<JwtPayload | undefined>;
}
