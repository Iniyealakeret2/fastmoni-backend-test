import { Model, Optional } from "sequelize";

export type SessionType = {
  id: string;
  user_id: string;
  otp: number | null;
  access_token: string;
  refresh_token: string;
};

export class SessionModel extends Model<
  SessionType,
  Optional<SessionType, "access_token" | "refresh_token" | "id">
> {
  public id!: string;
  public otp!: number;
  public user_id!: string;
  public access_token!: string;
  public refresh_token!: string;
}
