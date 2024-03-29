/* ************************************************************************************** *
 * ******************************                           ***************************** *
 * ******************************         USER ROUTES       ***************************** *
 * ******************************                           ***************************** *
 * ************************************************************************************** */

import { Router } from "express";
import { celebrate as validate } from "celebrate";

import UserValidation from "../validation/user.validation";
import UserController from "../controllers/user.controller";

const router = Router();

router
  .route("/:id/pin")
  .post(
    [validate(UserValidation.createAccountPin, { abortEarly: false })],
    UserController.createPin
  );

router
  .route("/:id/donate")
  .post([validate(UserValidation.donateAmount, { abortEarly: false })], UserController.donate);

router
  .route("/donations")
  .get([validate(UserValidation.getQuery, { abortEarly: false })], UserController.getDonations);

router
  .route("/:id/donation")
  .get([validate(UserValidation.idParam, { abortEarly: false })], UserController.getDonation);

router
  .route("/by-date")
  .get(
    [validate(UserValidation.dateQuery, { abortEarly: false })],
    UserController.getDonationsByDate
  );

export default router;
