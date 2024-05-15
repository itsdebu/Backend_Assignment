const express = require("express");
const router = express.Router();
const {
  createsubCategory,
  editSubcategory,
  getSubcategory,
} = require("../controllers/subcategoryController");
const { validateToken } = require("../middleware/ValidateTokenHandler");

router.post("/create", validateToken, createsubCategory);
router.put("/:subcategoryId", validateToken, editSubcategory);
// Get all subcategories using query.
router.get("/get", getSubcategory);

module.exports = router;
