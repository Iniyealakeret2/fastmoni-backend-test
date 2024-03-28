import httpStatus from "http-status";
import { Sequelize } from "sequelize";

import config from "../config";
import ErrorService from "../services/error.service";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `./src/config/${config.DATABASE_NAME}`,
});

export const connect = async () => {
  try {
    sequelize.sync().then(() => {
      console.log(`successfully connected to database ${config.DATABASE_NAME.substring(0, 8)}`);
    });
  } catch (error: any) {
    ErrorService.reportError({
      error,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: `unable to connect to database: ${config.DATABASE_NAME.substring(0, 8)}`,
    });
  }
};

export { sequelize };
