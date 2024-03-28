import { Request, Response, NextFunction } from "express";

export abstract class ErrorServiceInterface {
  /**
   * @method handler
   * @param {ExpressErrorInterface} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} res
   * @returns {void}
   */
  public static handler: (
    error: ExpressErrorInterface,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  /**
   * @method converter
   * @param {ExpressErrorInterface} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} res
   * @returns {void}
   */
  public static converter: (
    error: ExpressErrorInterface,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  /**
   * @method notFound
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  public static notFound: (req: Request, res: Response) => void;

  /**
   * @method reportError
   * @param {ErrorResponseInterface} error
   * @returns {ErrorResponseInterface}
   */
  public static reportError: (error: ErrorResponseInterface) => ErrorResponseInterface;
}
