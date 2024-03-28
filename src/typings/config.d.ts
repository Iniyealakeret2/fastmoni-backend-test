interface EnvironmentInterface extends NodeJS.ProcessEnv {
  PORT: string;
  BCRYPT_ROUND: string;
  DATABASE_NAME: string;
  OTP_MAX_NUMBER: number;
  OTP_MIN_NUMBER: number;
  DEFAULT_OTP_CODE: number;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_SECRET: string;
  NODE_ENV: "production" | "staging" | "development" | "test";
}

interface ErrorResponseInterface {
  error: string;
  stack?: string;
  status: number;
  message: string;
  payload?: object | null;
  errorData?: object | null;
}

interface ExpressErrorInterface extends Error {
  errors: string;
  status: number;
  stack: string | undefined;
  errorData?: object | null;
}
