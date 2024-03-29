import _ from "lodash";
import dayjs from "dayjs";
import { DataTypes } from "sequelize";

import config from "../config";
import { sequelize } from "../config/database";
import AuthService from "../services/auth.service";
import { UserModel, UserSessionType, UserType } from "../typings/user";
import BcryptService from "../services/bcrypt.service";

UserModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
    },

    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    full_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    is_verified: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },

    account_pin: {
      defaultValue: null,
      type: DataTypes.INTEGER,
    },

    wallet_balance: {
      defaultValue: null,
      type: DataTypes.STRING,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    timestamps: true,
    tableName: "users",
    modelName: "UserModel", // We need to choose the model name
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Before create hook
UserModel.beforeCreate(async (user) => {
  const hashedPassword = await BcryptService.hashPassword(user.password);
  user.password = hashedPassword;
  return;
});

// Method 3 via the direct method
UserModel.beforeUpdate(async (user) => {
  if (!user.changed("password")) return;

  const hashedPassword = await BcryptService.hashPassword(user.password);
  user.password = hashedPassword;
  return;
});

UserModel.prototype.validatePassword = function (password: string): boolean {
  return BcryptService.comparePassword(password, this.password);
};

UserModel.prototype.getSession = async function (): Promise<UserSessionType> {
  const user = this.toJSON() as unknown as UserType;

  const [access_token, refresh_token] = await Promise.all([
    AuthService.issueAccessToken(user),
    AuthService.issueRefreshToken(user),
  ]);

  const date = dayjs();
  const issued_at = date.unix(); // convert to unix timestamp
  const token_expiry = config.ACCESS_TOKEN_EXPIRY.replace(/\D/g, ""); // Matching for the numbers
  const expires_in = date.add(Number(token_expiry), "day").unix(); // convert to unix timestamp;
  const expires_at = dayjs(expires_in * 1000).toISOString();

  return {
    issued_at,
    expires_at,
    expires_in,
    access_token,
    refresh_token,
    user: { ...user, is_verified: true },
  };
};

UserModel.prototype.toJSON = function () {
  const { id, ...rest } = _.omit(this.dataValues, ["password", "account_pin"]);
  return { ...rest, id: String(id) };
};

export default UserModel;
