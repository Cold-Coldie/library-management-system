const { sequelize, syncDatabase } = require("../src/models");

beforeAll(async () => {
  // Sync database with force true to ensure clean state
  await syncDatabase(true);
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});
