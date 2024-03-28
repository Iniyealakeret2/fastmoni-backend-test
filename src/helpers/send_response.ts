/**
 * @description Response builder function for user requests
 * @function sendResponse
 * @typedef ResponseInterface
 * @param {object} ResponseInterface - response payload object
 * @returns {ResponseInterface} {ResponseInterface} Returns the Response object
 */

import { ResponseInterface } from "../typings/helpers";

export function sendResponse({
  status,
  message,
  payload = null,
}: ResponseInterface): ResponseInterface {
  return { message, payload, status };
}
