import "./modules/users/models/user.model.js";
import { sequelize } from "./db/sequelize.js";
import { config } from "./config/index.js";
import { createApp } from "./app.js";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: config.env === "development" });
    console.log("Models synced");

    const app = createApp();
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

main();
