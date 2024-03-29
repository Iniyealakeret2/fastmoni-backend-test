import { Model, Optional } from "sequelize";

export type WalletType = {
  id: string;
  owner_id: string;
  wallet_number?: number;
  wallet_balance?: number;
};

export class WalletModel extends Model<WalletType, Optional<WalletType, "wallet_balance" | "id">> {
  public id!: string;
  public owner_id!: string;
  public wallet_number!: number;
  public wallet_balance!: number;
}
