import { Joi } from "celebrate";

import { config as configEnv } from "dotenv";

configEnv();

const envVarsSchema = Joi.object<EnvironmentInterface>({
  DATABASE_NAME: Joi.string(),

  PORT: Joi.number().default(4040),

  EMAIL_AUTH_USER: Joi.string().required(),

  ACCESS_TOKEN_SECRET: Joi.string().required(),

  OTP_MIN_NUMBER: Joi.number().default(100000),

  OTP_MAX_NUMBER: Joi.number().default(900000),

  EMAIL_AUTH_PASSWORD: Joi.string().required(),

  REFRESH_TOKEN_SECRET: Joi.string().required(),

  DEFAULT_OTP_CODE: Joi.number().default(123456),

  ACCESS_TOKEN_EXPIRY: Joi.string().default("30d"),

  REFRESH_TOKEN_EXPIRY: Joi.string().default("1yr"),

  BCRYPT_ROUND: Joi.string().default("10").required(),

  NODE_ENV: Joi.string()
    .valid("development", "staging", "production", "test")
    .default("development"),

  DEBUG_DATA_BASE: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
})
  .unknown()
  .required();

const { error, value: envVariables } = envVarsSchema.validate(process.env, {
  abortEarly: false,
});

if (error) throw new Error(`Config validation error: ${error.message}`);

if (
  envVariables!!.NODE_ENV !== "production" &&
  envVariables!!.NODE_ENV !== "staging" &&
  envVariables!!.NODE_ENV !== "development" &&
  envVariables!!.NODE_ENV !== "test"
) {
  console.error(
    `NODE_ENV is set to ${
      envVariables!!.NODE_ENV
    }, but only production, staging, development and test environments are valid.`
  );
  process.exit(1);
}

export default envVariables as EnvironmentInterface;
