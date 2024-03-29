import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import config from "../config/index";
import ErrorService from "./error.service";
import { EmailServiceInterface } from "../typings/services";

/**
 *
 * @class EmailService
 * @extends EmailServiceInterface
 * @classdesc Class representing the email service
 * @description Email message notification service class
 * @name EmailService
 * @exports EmailServiceInterface
 */

export default class EmailService extends EmailServiceInterface {
  protected static transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  static init() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if we don't have a real mail account for testing in development
    if (config.NODE_ENV === "test") {
      nodemailer.createTestAccount().then(({ user, pass }) => {
        EmailService.initiateTransporter({
          secure: false,
          auth: { user, pass },
          host: "smtp.ethereal.email",
        });
      });
    }

    // Custom mailgun transport for nodemailer
    EmailService.initiateTransporter({
      host: "smtp.elasticemail.com",
      auth: {
        user: config.EMAIL_AUTH_USER,
        pass: config.EMAIL_AUTH_PASSWORD,
      },
    });
  }

  /**
   * @async
   * @method initiateTransporter
   * @description Initiate email transporter
   * @param {SMTPTransport.Options | undefined} options - transport configuration
   * @returns {void} void
   * @memberof SmsServiceInterface
   */
  static initiateTransporter(options?: SMTPTransport.Options): void {
    // create reusable transporter object using the default SMTP transport
    if (EmailService.transporter) return;
    EmailService.transporter = nodemailer.createTransport({ port: 2525, ...options });
  }

  /**
   * @async
   * @method sendMail
   * @description Send a user email message
   * @param {nodemailer.SendMailOptions} options - message object
   * @returns {Promise<SMTPTransport.SentMessageInfo>} {Promise<SMTPTransport.SentMessageInfo>}
   * @memberof SmsServiceInterface
   */
  public static sendMail = async (
    options: nodemailer.SendMailOptions
  ): Promise<SMTPTransport.SentMessageInfo | ErrorResponseInterface> => {
    try {
      const payload = { ...options, from: "harry@fanful.app" };

      const response = await EmailService.transporter.sendMail(payload);

      return response;
    } catch (error: any) {
      return ErrorService.reportError({
        errorData: error,
        status: error.status,
        message: `Failed sending email to ${options.to}`,
        error: `Error sending email on ${options.subject}`,
      });
    }
  };
}
