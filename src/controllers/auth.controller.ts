import _ from "lodash";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import config from "../config";
import { UserType } from "../typings/user";
import UserModel from "../model/user.model";
import APIError from "../helpers/api.errors";
import WalletModel from "../model/wallet.model";
import SessionModel from "../model/session.model";
import { generateOTP } from "../helpers/generate_otp";
import { sendResponse } from "../helpers/send_response";
import { AuthControllerInterface } from "../typings/auth";
import { ExpressResponseInterface } from "../typings/helpers";

/**
 *
 * @class
 * @extends AuthControllerInterface
 * @classdesc Class representing the authentication controller
 * @description App authentication controller
 * @name AuthController
 *
 */
export default class AuthController extends AuthControllerInterface {
  /**
   * Route: POST: /auth/signup
   * @async
   * @method signup
   * @description signup user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { email }: UserType = req.body;

      let user = await UserModel.findOne({ where: { email } });

      if (!user) {
        user = await UserModel.create({ ...req.body });
      }

      if (user.is_verified) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Account already registered with us",
        });
      }

      const code = config.IS_PRODUCTION_OR_STAGING ? generateOTP() : config.DEFAULT_OTP_CODE;

      let session = await SessionModel.findOne({ where: { id: user.id } });

      if (!session) {
        session = await SessionModel.create({ otp: code, user_id: user.id });
      }

      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "success", status: httpStatus.CREATED }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/signin
   * @async
   * @method signin
   * @description signin to user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { email, password }: UserType = req.body;

      const user = await UserModel.findOne({ where: { email, is_verified: true } });

      if (!user) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid email or password",
        });
      }

      const isCorrect = user.validatePassword(password!!);

      if (!isCorrect) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid, email or password",
        });
      }

      const session = await user.getSession();

      await SessionModel.update(
        { ..._.pick(session, ["refresh_token", "access_token"]) },
        { where: { user_id: user.id } }
      );

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, message: "successful", payload: session }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/verify-otp
   * @async
   * @method verifyOtp
   * @description verify users otp
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { otp, email }: UserType & { otp: string } = req.body;

      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid email or password",
        });
      }

      if (!user) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid OTP",
        });
      }

      const session = await SessionModel.findOne({ where: { user_id: user.id, otp } });

      if (!session) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid OTP",
        });
      }

      await Promise.all([
        WalletModel.create({ owner_id: user.id }),
        UserModel.update({ is_verified: true }, { where: { email } }),
        SessionModel.update({ otp: null }, { where: { user_id: user.id } }),
      ]);

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, message: "Verified successfully" }));
    } catch (error) {
      next(error);
    }
  }
}
