const express = require("express");
const router = express.Router();
const {
  editCategory,
  getCategories,
  createCategory,
} = require("../controllers/categoryController");
const { validateToken } = require("../middleware/ValidateTokenHandler");

router.post("/create", validateToken, createCategory);
router.post("/edit/:categoryId", validateToken, editCategory);
// using this same api we can get all the categoriesby using req.query
router.get("/get", getCategories);

module.exports = router;
