const Sequelize = require("sequelize");
const db = require("../config/database");

const Employees = db.define("employees", {
  name: {
    type: Sequelize.STRING,
  },
  job_title: {
    type: Sequelize.STRING,
  },
  department: {
    type: Sequelize.STRING,
  },
  line_manager: {
    type: Sequelize.STRING,
  },
  date_joined: {
    type: Sequelize.DATE,
  },
});

Employees.associate = (models) => {
  Employees.hasMany(models.Comments, {
    foreignKey: "id",
  });
};

Employees.sync().then(() => {
  console.log("Employee table created");
});
module.exports = Employees;
