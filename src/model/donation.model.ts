import _ from "lodash";
import { DataTypes } from "sequelize";

import { UserModel } from "../typings/user";
import { sequelize } from "../config/database";
import { DonationModel } from "../typings/donations";
import { generateTxnId } from "../helpers/generate_txn_id";

DonationModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    date: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(Date.now()),
    },

    txn_id: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: () => generateTxnId(),
    },

    sender_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },

    beneficiary_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },

    amount_donated: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    timestamps: true,
    tableName: "donations",
    modelName: "DonationModel", // We need to choose the model name
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associate the models
UserModel.hasMany(DonationModel, { foreignKey: "sender_id", as: "sentDonations" });

UserModel.hasMany(DonationModel, { foreignKey: "beneficiary_id", as: "receivedDonations" });

DonationModel.belongsTo(UserModel, { foreignKey: "sender_id", as: "sender" });

DonationModel.belongsTo(UserModel, { foreignKey: "beneficiary_id", as: "beneficiary" });

DonationModel.prototype.toJSON = function () {
  const { id, ...rest } = this.dataValues;
  return { ...rest, id: String(id) };
};

export default DonationModel;
