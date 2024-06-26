import { Model, Optional } from "sequelize";

export type DonationType = {
  id: string;
  date: Date;
  txn_id?: string;
  sender_id: string;
  beneficiary_id: string;
  amount_donated: number;
};

export type DonationQueryParams = {
  startDate: Date;
  endDate: Date;
};

export type DonationQueryValidationType = {
  page: number;
  limit: number;
};

export class DonationModel extends Model<
  DonationType,
  Optional<DonationType, "id" | "date"> | "txn_id"
> {
  public id!: string;
  public date!: Date;
  public txn_id!: string;
  public sender_id!: string;
  public beneficiary_id!: string;
  public amount_donated!: number;

  static associate(models: any) {
    DonationModel.belongsTo(models.UserModel, { foreignKey: "sender_id", as: "sender" });
    DonationModel.belongsTo(models.UserModel, { foreignKey: "beneficiary_id", as: "beneficiary" });
  }
}
