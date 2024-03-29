import _ from "lodash";
import httpStatus from "http-status";
import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express";

import { UserType } from "../typings/user";
import UserModel from "../model/user.model";
import APIError from "../helpers/api.errors";
import WalletModel from "../model/wallet.model";
import * as EmailTemplate from "../template/index";
import DonationModel from "../model/donation.model";
import { useSession } from "../helpers/use_session";
import EmailService from "../services/email.service";
import { sendResponse } from "../helpers/send_response";
// import { extractDate } from "../helpers/date_extractor";
import { UserControllerInterface } from "../typings/user";
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
   * Route: GET: /user/:id/account
   * @async
   * @method accountDetails
   * @description get user account details
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async accountDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const user = await UserModel.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: WalletModel,
            as: "walletDetails",
            attributes: ["wallet_number", "wallet_balance", "id"],
          },
        ],
      });

      if (!user) {
        throw new APIError({
          message: "User not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", payload: user, status: httpStatus.OK }));
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

      const beneficiaryWallet = await WalletModel.findOne({ where: { wallet_number } });

      if (!beneficiaryWallet) {
        throw new APIError({
          message: "Wallet not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const beneficiaryExists = await UserModel.findOne({
        where: { id: beneficiaryWallet.owner_id },
      });

      if (!beneficiaryExists) {
        throw new APIError({
          message: "Account not found",
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

      beneficiaryWallet.wallet_balance = beneficiaryWallet.wallet_balance + amount_donated;

      await beneficiaryWallet.save();

      const donations: DonationModel[] = await DonationModel.findAll({
        where: { sender_id: id, beneficiary_id: beneficiaryExists.id },
      });

      // send thank yu message when donations are more than one
      if (donations.length > 2) {
        EmailService.sendMail({
          to: String(userExists.email),
          subject: "Thank you message",
          html: EmailTemplate.thankYouMessageTemplate({
            beneficiary_name: String(beneficiaryExists.full_name) || "Emmanuel",
          }),
        });
      }

      return res.status(httpStatus.CREATED).json(
        sendResponse({
          message: "Donated successfully",
          status: httpStatus.OK,
          payload: {
            amount: amount_donated,
            txn_id: donated.txn_id,
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
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { id } = useSession();

      const donations = await DonationModel.findAndCountAll({
        where: { sender_id: id },
        include: [
          { model: UserModel, as: "beneficiary", attributes: ["full_name", "email", "id"] },
        ],
        offset: (Number(req.query.page) - 1) * Number(req.query.limit) || 1,
        limit: Number(req.query.page) || 10,
      });

      if (!donations.rows.length) {
        throw new APIError({
          message: "Donations not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      return res.status(httpStatus.OK).json(
        sendResponse({
          message: "success",
          status: httpStatus.OK,
          payload: donations,
        })
      );
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
      const donations = await DonationModel.findAndCountAll({
        where: {
          date: {
            [Op.between]: [
              new Date(String(req.query.startDate)),
              new Date(String(req.query.endDate)),
            ],
          },
        },
        include: [
          { model: UserModel, as: "beneficiary", attributes: ["full_name", "email", "id"] },
        ],
        offset: (Number(req.query.page) - 1) * Number(req.query.limit) || 1,
        limit: Number(req.query.page) || 10,
      });

      if (!donations.rows.length) {
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
