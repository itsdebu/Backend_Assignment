const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
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
    baseAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Referencing the Category model
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory", // Referencing the Subcategory model
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
