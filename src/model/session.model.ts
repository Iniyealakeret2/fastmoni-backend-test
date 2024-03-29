import { DataTypes } from "sequelize";

import { UserModel } from "../typings/user";
import { sequelize } from "../config/database";
import { SessionModel } from "../typings/session";

SessionModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    otp: {
      defaultValue: null,
      type: DataTypes.INTEGER,
    },

    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },

    access_token: {
      defaultValue: null,
      type: DataTypes.STRING,
    },

    refresh_token: {
      defaultValue: null,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize, // We need to pass the connection instance
    timestamps: true,
    tableName: "sessions",
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: "SessionModel", // We need to choose the model name
  }
);

// UserModel.belongsTo(SessionModel, { foreignKey: "user_id", targetKey: "id" });
// SessionModel.hasOne(UserModel, { foreignKey: "user_id", sourceKey: "id" });

SessionModel.belongsTo(UserModel, { foreignKey: "user_id", targetKey: "id" });
UserModel.hasOne(SessionModel, { foreignKey: "user_id", sourceKey: "id" });

export default SessionModel;
