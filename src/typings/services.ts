import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Bcrypt Service Interface
 */
export abstract class BcryptServiceInterface {
  /**
   * @method hashPassword
   * @param {password} string
   * @returns {Promise<string>}
   */
  public static hashPassword: (password: string) => Promise<string>;

  /**
   * @method comparePassword
   * @param {string} password
   * @param {string} hash
   * @returns {boolean}
   */
  public static comparePassword: (password: string, hash: string) => boolean;
}

/**
 * Email Service Interface
 */
export abstract class EmailServiceInterface {
  /**
   * @method sendMail
   * @param {nodemailer.SendMailOptions} options
   * @returns {Promise<SMTPTransport.SentMessageInfo>}
   */
  public static sendMail: (
    options: nodemailer.SendMailOptions
  ) => Promise<SMTPTransport.SentMessageInfo | ErrorResponseInterface>;

  /**
   * @method sendMail
   * @param {SMTPTransport.Options} options
   * @returns {void}
   */
  static initiateTransporter: (options?: SMTPTransport.Options) => void;
}
