require("dotenv").config();
const Sequelize = require("sequelize");

// Add connection string in .env file in the following format
// Example: postgres://user:password@localhost:5432/db
// (db name - management_sys)
module.exports = new Sequelize(process.env.DB_CONNECTION_STRING, {
  host: "localhost",
  dialect: "postgres",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});