/**
 *
 * @description A function that helps generate unique transaction ids
 * @function generateTxnId
 * @returns string
 */

import cryptoRandomString from "crypto-random-string";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const generateTxnId = (): string => {
  return `txn-${cryptoRandomString({ length: 16, characters }).toLowerCase()}`;
};
