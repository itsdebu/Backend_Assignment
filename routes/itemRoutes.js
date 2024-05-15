const express = require("express");
const router = express.Router();
const {
  createItem,
  getItems,
  editItem,
} = require("../controllers/itemsController");
const { validateToken } = require("../middleware/ValidateTokenHandler");

router.post("/create", validateToken, createItem);
router.put("/:itemId", validateToken, editItem);
router.get("/get", getItems);

module.exports = router;
