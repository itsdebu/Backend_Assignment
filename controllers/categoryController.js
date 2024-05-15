const Category = require("../models/categoryModel");

const createCategory = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, img, desc, taxApplicable, taxPercentage, taxType } = req.body;

    // Create a new category instance
    const newCategory = new Category({
      name,
      img,
      desc,
      taxApplicable,
      taxPercentage,
      taxType,
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    // Respond with the saved category
    res.status(201).json(savedCategory);
  } catch (err) {
    // Handle errors
    console.error("Error creating category:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error Check Console for more Details." });
  }
};

const getCategories = async (req, res) => {
  try {
    const { identifier } = req.params;
    let categories;

    // Check if identifier exists
    if (identifier) {
      // Identifier provided, search for category by name or ID
      if (!isNaN(identifier)) {
        // Identifier is a number, assume it's an ID
        categories = await Category.findById(identifier);
      } else {
        // Identifier is a string, assume it's a name
        categories = await Category.find({
          name: { $regex: identifier, $options: "i" },
        });
      }
    } else {
      // No identifier provided, fetch all categories
      categories = await Category.find();
    }

    if (!categories) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error("Error getting categories:", err);
    res
      .status(500)
      .json({
        success: false,
        error: "Internal Server Error Check Console for more Details",
      });
  }
};
