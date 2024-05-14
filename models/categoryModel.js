const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    desc: {
      type: String,
    },
    taxApplicable: {
      type: Boolean,
      default: false,
    },
    taxPercentage: {
      type: String,
    },
    taxType: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Category = mongoose.Model("Category", categorySchema);

module.exports = Category;