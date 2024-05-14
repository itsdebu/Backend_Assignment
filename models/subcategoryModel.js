const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    taxApplicable: {
      type: Boolean,
      default: false,
    },
    taxPercentage: {
      type: Number,
    },
    taxType: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Referencing the Category model
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
