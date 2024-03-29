import { Model } from "sequelize";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { ExpressResponseInterface } from "./helpers";

export type UserType = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  account_pin?: number;
  is_verified?: boolean;
  wallet_balance?: string;
};

export type UserSessionType = {
  access_token: string;
  /**
   * A timestamp of when the token was issued. Returned when a login is confirmed.
   */
  issued_at: number;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at: string;
  refresh_token: string;
  user: Partial<UserType> | null;
};

export class UserModel extends Model<UserType> {
  public id!: string;
  public email!: string;
  public password!: string;
  public full_name!: string;
  public account_pin!: number;
  public is_verified!: boolean;
  getSession!: () => Promise<UserSessionType>;
  validatePassword!: (password: string) => boolean;
}

export interface UserTokenType extends Omit<JwtPayload, "aud">, UserType {
  aud: string;
}

export abstract class UserControllerInterface {
  /**
   * @async
   * @method signup
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static createPin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method donate
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static donate: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method getDonations
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static getDonations: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method getDonation
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static getDonation: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method getDonationsByDate
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static getDonationsByDate: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;
}
