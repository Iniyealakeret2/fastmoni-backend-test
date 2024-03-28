import httpStatus from "http-status";
import { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import UserModel from "../model/user.model";
import { SessionType } from "../typings/session";
import SessionModel from "../model/session.model";
import authService from "../services/auth.service";
import { useSession } from "../helpers/use_session";
import { sendResponse } from "../helpers/send_response";
import { AuthPolicyInterface } from "../typings/policies";
import { ExpressResponseInterface } from "../typings/helpers";

/**
 *
 * @class
 * @extends AuthPolicyInterface
 * @classdesc Authenticate users, admins and super admins middleware
 * @description App authentication policy controller
 * @name AuthController
 *
 */

export default class AuthPolicy extends AuthPolicyInterface {
  /**
   * Function representing the Authorization check for authenticated users
   * @method hasAccessToken
   * @description Authenticate users, admins and super admins middleware who has valid access_token
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction function
   * @returns {ExpressResponseInterface} {ExpressResponseInterface} Returns the Response object containing token field with the verified token assigned to the user
   * @memberof AuthPolicyInterface
   */

  static async hasAccessToken(
    req: Request,
    res: Response,
    next?: NextFunction
  ): ExpressResponseInterface {
    const access_token = req?.header("Authorization");

    const [bearer, signature] = access_token?.split(" ") || [];

    if (signature && bearer === "Bearer") {
      try {
        const token = await authService.verifyAccessToken(signature);

        //@ts-ignore
        const user = await UserModel.findOne({ id: token?.aud, email: token?.email });
        if (!user) {
          Error("Invalid Token");
        }

        //@ts-ignore
        const session = await SessionModel.findOne({ access_token, user_id: token?.aud });

        if (!session) {
          Error("Invalid Token");
        }

        const { setSession } = useSession();
        setSession({ ...token, ...session?.toJSON(), ...user.toJSON(), user, session });

        return next?.();
      } catch (error) {
        const message = `${error instanceof TokenExpiredError ? "Expired" : "Invalid"} token`;
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(sendResponse({ message, status: httpStatus.UNAUTHORIZED }));
      }
    }

    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(sendResponse({ message: "No Token found", status: httpStatus.UNAUTHORIZED }));
  }

  /**
   * Function representing the Authorization token refresher for unauthorized users
   * @method hasRefreshToken
   * @description Refresh users access_token middleware
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction function
   * @returns {ExpressResponseInterface} {ExpressResponseInterface} Returns the Response object containing token field with the refreshed token assigned to the user
   * @memberof AuthPolicyInterface
   */
  static async hasRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    const { refresh_token }: Pick<SessionType, "refresh_token"> = req.body;

    try {
      const token = await authService.verifyRefreshToken(refresh_token);

      //@ts-ignore
      const user = await UserModel.findOne({ id: token?.aud, email: token?.email });

      if (!user) {
        Error("Invalid Token");
      }

      const session = await SessionModel.findOne({
        //@ts-ignore
        user_id: token?.aud,
        refresh_token: { $ne: null },
      });

      if (!session) {
        Error("Invalid Token");
      }

      if (refresh_token !== session?.refresh_token) {
        throw new Error("Invalid Token");
      }

      const { setSession } = useSession();
      setSession({ ...token, ...session?.toJSON(), ...user.toJSON(), user });

      return next();
    } catch (error) {
      const message = `${error instanceof TokenExpiredError ? "Expired" : "Invalid"} token`;
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(sendResponse({ message, status: httpStatus.UNAUTHORIZED }));
    }
  }
}
