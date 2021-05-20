const express = require("express");
const router = express.Router();
const Comments = require("../models/Comments");
const Employees = require("../models/Employees");
const { body, validationResult } = require("express-validator");

/**
 * Display add employee form
 */
router.get("/add", (req, res) => res.render("addComment"));

/**
 * Add new comment
 * @param {string} comment_content
 * @param {string} author
 * @param {string} employee_name
 */
router.post(
  "/add",
  body(
    ["comment_content", "author", "employee_name"],
    "Please provide a valid string value"
  ).isString(),
  async (req, res) => {
    let { employee_name, comment_content, author } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const employee = await Employees.findOne({
        where: { name: employee_name },
      });

      // bail out early if employee is not found
      if (!employee) {
        return res.status(404).json({ msg: "Employee record not found" });
      }

      // Insert into table
      const newComment = await Comments.create({
        comment_content,
        author,
        employee_name,
        employee_id: employee.id,
      });
      res.redirect("/");
    } catch (e) {
      throw new Error(`Something went wrong while adding new comment: ${e}`);
    }
  }
);

/**
 * Update employee information
 * @param {string} comment_content
 * @param {string} author
 */
router.put(
  "/:id",
  body(
    ["comment_content", "author"],
    "Please provide a valid string value"
  ).isString(),
  async (req, res) => {
    const id = req.params.id;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const comment = await Comments.findByPk(id);
      // bail out early if comment is not found
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }

      let updatePayload = req.body;

      // Update payload properties
      for (const key of Object.keys(updatePayload)) {
        comment[key] = updatePayload[key];
      }

      await comment.save();
      res.redirect("/");
    } catch (error) {
      throw new Error(`Something went wrong while updating comment: ${error}`);
    }
  }
);

/**
 * Get comments list
 */
router.get("/", async (req, res) => {
  const comments = await Comments.findAll({
    raw: true,
  });
  res.render("comments", { comments });
});

/**
 * Get comments by employee id
 * @param {number} id
 */
router.get("/employee/:id", async (req, res) => {
  const id = req.params.id;
  const comments = await Comments.findAll({
    where: { employee_id: id },
    raw: true,
  });

  res.render("comments", { comments });
});

/**
 * Get single comment by id
 * @param {number} id
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const comment = await Comments.findByPk(id);
  if (comment) {
    res.json(comment);
  }
  res.status(404).json({ msg: "Comment not found." });
});

/**
 * Delete single comment by id
 * @param {number} id
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const comment = await Comments.findByPk(id);
  if (comment) {
    await Comments.destroy({
      where: {
        id: comment.id,
      },
    });
    res.json({ msg: `Comment was successfully deleted` });
  } else {
    res.status(404).json({ msg: "Comment not found." });
  }
});

/**
 * Delete all comments related to employee
 * @param {number} id
 */
router.delete("/employee/:id", async (req, res) => {
  const id = req.params.id;
  const employee = await Employees.findByPk(id);
  // bail out early if employee is not found
  if (!employee) {
    return res.status(404).json({ msg: "Employee not found" });
  }

  try {
    await Comments.destroy({
      where: {
        employee_id,
      },
    });
    res.json({
      msg: `All comments related to employee record are successfully deleted`,
    });
  } catch (e) {
    throw new Error(
      `Something went wrong while deleting all employee comments: ${e}`
    );
  }
});

module.exports = router;
