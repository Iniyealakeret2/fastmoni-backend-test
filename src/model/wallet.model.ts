import _ from "lodash";
import { DataTypes } from "sequelize";

import { UserModel } from "../typings/user";
import { sequelize } from "../config/database";
import { WalletModel } from "../typings/wallet";
import { generateWalletNumber } from "../helpers/generate_wallet_number";

WalletModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    owner_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },

    wallet_balance: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },

    wallet_number: {
      type: DataTypes.INTEGER,
      defaultValue: () => generateWalletNumber(),
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    timestamps: true,
    tableName: "wallets",
    modelName: "WalletModel", // We need to choose the model name
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associate the models
UserModel.hasOne(WalletModel, { foreignKey: "owner_id", as: "walletDetails" });

WalletModel.belongsTo(UserModel, { foreignKey: "owner_id", as: "userDetails" });

WalletModel.prototype.toJSON = function () {
  const { id, ...rest } = this.dataValues;
  return { ...rest, id: String(id) };
};

export default WalletModel;
