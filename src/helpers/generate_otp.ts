import config from "../config";

export const generateOTP = (
  min: number = config.OTP_MIN_NUMBER,
  max: number = config.OTP_MAX_NUMBER
) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
