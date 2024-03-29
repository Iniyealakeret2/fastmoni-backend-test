import _ from "lodash";
import httpStatus from "http-status";
import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express";

// import config from "../config";
import { UserType } from "../typings/user";
import UserModel from "../model/user.model";
import APIError from "../helpers/api.errors";
import WalletModel from "../model/wallet.model";
import DonationModel from "../model/donation.model";
import { useSession } from "../helpers/use_session";
import { sendResponse } from "../helpers/send_response";
import { UserControllerInterface } from "../typings/user";
import { DonationQueryParams } from "../typings/donations";
import { ExpressResponseInterface } from "../typings/helpers";

/**
 *
 * @class
 * @extends UserControllerInterface
 * @classdesc Class representing the user controller
 * @description App authentication controller
 * @name UserController
 *
 */
export default class UserController extends UserControllerInterface {
  /**
   * Route: POST: /user/:id/pin
   * @async
   * @method createPin
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async createPin(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { account_pin }: UserType = req.body;

      const user = await UserModel.findOne({ where: { id: req.params.id } });

      if (!user) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      await UserModel.update({ account_pin }, { where: { id: user.id } });

      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "pin created successfully", status: httpStatus.CREATED }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /user/:id/donate
   * @async
   * @method donate
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async donate(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { id } = useSession();

      const { amount_donated, wallet_number, pin } = req.body;

      const userExists = await UserModel.findOne({
        where: { id, account_pin: pin },
      });

      if (!userExists) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const beneficiaryExists = await UserModel.findOne({ where: { id: req.params.id } });

      if (!beneficiaryExists) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const beneficiaryWallet = await WalletModel.findOne({
        where: { wallet_number, owner_id: beneficiaryExists.id },
      });

      if (!beneficiaryWallet) {
        throw new APIError({
          message: "Wallet not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const donated = await DonationModel.create({
        sender_id: id,
        amount_donated,
        beneficiary_id: beneficiaryExists.id,
      });

      if (!donated) {
        throw new APIError({
          message: "Invalid account details",
          status: httpStatus.NOT_FOUND,
        });
      }

      beneficiaryWallet.wallet_balance = amount_donated;

      await beneficiaryWallet.save();

      return res.status(httpStatus.CREATED).json(
        sendResponse({
          message: "Donated successfully",
          status: httpStatus.OK,
          payload: {
            donated_amount: amount_donated,
            sender_name: userExists.full_name,
            beneficiary_name: beneficiaryExists?.full_name,
            beneficiary_account_number: beneficiaryWallet.wallet_number,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/donations
   * @async
   * @method getDonations
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async getDonations(
    _req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { id } = useSession();

      const donations = await DonationModel.findAll({
        where: { sender_id: id },
        include: [
          { model: UserModel, as: "beneficiary", attributes: ["full_name", "email", "id"] },
        ],
      });

      if (!donations.length) {
        throw new APIError({
          message: "Donations not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", payload: donations, status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/donation
   * @async
   * @method getDonation
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async getDonation(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { id } = useSession();

      const donation = await DonationModel.findOne({
        where: { id: req.params.id, sender_id: id },
        include: [
          { model: UserModel, as: "beneficiary", attributes: ["full_name", "email", "id"] },
        ],
      });

      if (!donation) {
        throw new APIError({
          message: "Donation not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", payload: donation, status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/donation
   * @async
   * @method getDonationsByDate
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async getDonationsByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { startDate, endDate }: DonationQueryParams =
        req.query as unknown as DonationQueryParams;

      const donations: DonationModel[] = await DonationModel.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      if (!donations.length) {
        throw new APIError({
          message: "Donation not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", payload: donations, status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }
}
