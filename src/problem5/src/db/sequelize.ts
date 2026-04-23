import { Sequelize } from "sequelize";
import { config } from "../config/index.js";

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: config.env === "development" ? (msg) => console.log(msg) : false,
  },
);
