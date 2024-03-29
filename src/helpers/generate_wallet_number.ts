import config from "../config";

export const generateWalletNumber = (
  min: number = config.OTP_MIN_NUMBER,
  max: number = config.OTP_MAX_NUMBER
) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Number(`2267${Math.floor(Math.random() * (max - min + 1)) + min}`);
};
