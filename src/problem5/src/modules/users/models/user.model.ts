import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../../../db/sequelize.js";
import type { UserRole } from "../dto/user.dto.js";

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  age: number | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "age" | "role" | "createdAt" | "updatedAt"
>;

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare name: string;
  declare age: number | null;
  declare role: UserRole;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["role"] },
    ],
  },
);
