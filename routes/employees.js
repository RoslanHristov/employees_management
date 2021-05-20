const express = require("express");
const router = express.Router();
const Employees = require("../models/Employees");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { body, validationResult } = require("express-validator");

// Display add gig form
router.get("/add", (req, res) => res.render("addEmployee"));

// Add an employee
router.post(
  "/add",
  body(
    ["name", "job_title", "department", "line_manager"],
    "Please provide a valid string value"
  ).isString(),
  body(
    "date_joined",
    "Please provide a valid date format 'YYYY/MM/DD' / 'YYYY-MM-DD'"
  ).isDate(),
  async (req, res) => {
    const { name, job_title, department, line_manager, date_joined } = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Insert employees record
      const newEmployee = await Employees.create({
        name,
        job_title,
        department,
        line_manager,
        date_joined,
      });
      res.json(newEmployee);
      res.redirect("/employees/add");
    } catch (error) {
      throw new Error(
        `Something went wrong while inserting employee record: ${error}`
      );
    }
  }
);

// Update an employee
router.put(
  "/:id",
  body(
    ["name", "job_title", "department", "line_manager"],
    "Please provide a valid string value"
  ).isString(),
  body(
    "date_joined",
    "Please provide a valid date format 'YYYY/MM/DD' / 'YYYY-MM-DD'"
  ).isDate(),
  async (req, res) => {
    const id = req.params.id;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const employee = await Employees.findByPk(id);
      // bail out early if employee is not found
      if (!employee) {
        return res.status(404).json({ msg: "Employee record not found" });
      }

      let updatePayload = req.body;

      // Update payload properties
      for (const key of Object.keys(updatePayload)) {
        employee[key] = updatePayload[key];
      }

      await employee.save();
      res.json(employee);
    } catch (error) {
      throw new Error(
        `Something went wrong while updating employee record: ${error}`
      );
    }
  }
);

// Get employees list
router.get("/", async (req, res) => {
  const employees = await Employees.findAll();
  if (employees.length > 0) {
    res.json(employees);
  }
  res.status(404).json({ msg: "No employees found." });
});

// Get employee by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const employee = await Employees.findByPk(id);
  if (employee) {
    res.json(employee);
  }
  res.status(404).json({ msg: "Employee not found." });
});

// Search for employee
router.get("/search/all", async (req, res) => {
  let { name } = req.query;
  // Make first letter uppercase, since we're searching by name
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  const hitResultsArr = await Employees.findAll({
    where: {
      name: { [Op.like]: "%" + nameCapitalized + "%" },
    },
  });

  if (hitResultsArr.length > 0) {
    res.json(hitResultsArr);
  } else {
    res.status(404).json({ msg: "No search results found." });
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const employee = await Employees.findByPk(id);
  if (employee) {
    await Employees.destroy({
      where: {
        id: employee.id,
      },
    });
    res.json({ msg: `Employee was successfully deleted` });
  } else {
    res.status(404).json({ msg: "Employee not found." });
  }
});

module.exports = router;
