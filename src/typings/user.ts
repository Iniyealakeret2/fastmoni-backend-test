import { Model } from "sequelize";
import { JwtPayload } from "jsonwebtoken";

export type UserType = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  account_pin?: number;
  is_verified?: boolean;
  wallet_balance?: string;
};

export type UserSessionType = {
  access_token: string;
  /**
   * A timestamp of when the token was issued. Returned when a login is confirmed.
   */
  issued_at: number;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at: string;
  refresh_token: string;
  user: Partial<UserType> | null;
};

export class UserModel extends Model<UserType> {
  public id!: string;
  public email!: string;
  public password!: string;
  public full_name!: string;
  public account_pin!: number;
  public is_verified!: boolean;
  getSession!: () => Promise<UserSessionType>;
  validatePassword!: (password: string) => boolean;
}

export interface UserTokenType extends Omit<JwtPayload, "aud">, UserType {
  aud: string;
}
