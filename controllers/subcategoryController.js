const subCategory = require("../models/subcategoryModel");

const createsubCategory = async (req, res) => {
  try {
    // Extract data from request body
    const { name, img, desc, taxApplicable, taxPercentage, taxType, category } =
      req.body;

    // Create a new subcategory instance
    const newSubcategory = new Subcategory({
      name,
      img,
      desc,
      taxApplicable,
      taxPercentage,
      taxType,
      category,
    });

    // Save the new subcategory to the database
    const savedSubcategory = await newSubcategory.save();

    // Respond with the saved subcategory
    res.status(201).json(savedSubcategory);
  } catch (err) {
    // Handle errors
    console.error("Error creating subcategory:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSubcategory = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Check if identifier exists
    if (identifier) {
      // Identifier provided

      // Check if identifier is not a number
      if (isNaN(identifier)) {
        // Identifier is not a number, try to find subcategory by name
        const subcategoriesByName = await Subcategory.find({
          name: { $regex: identifier, $options: "i" },
        });
        if (subcategoriesByName.length > 0) {
          // Subcategory(s) found, return them
          return res
            .status(200)
            .json({ success: true, subcategories: subcategoriesByName });
        }
      } else {
        // Identifier is a number, try to find subcategory by ID
        const subcategory = await Subcategory.findById(identifier);
        if (subcategory) {
          // Subcategory found, return it
          return res.status(200).json({ success: true, subcategory });
        }

        // If identifier is not a subcategory ID, check if it's a category ID
        const category = await Category.findById(identifier);
        if (category) {
          // Identifier is a category ID, fetch subcategories under that category
          const subcategories = await Subcategory.find({
            category: identifier,
          });
          return res.status(200).json({ success: true, subcategories });
        }
      }

      // No subcategory found with the provided identifier
      return res
        .status(404)
        .json({ success: false, error: "Subcategory not found" });
    } else {
      // No identifier provided, fetch all subcategories
      const subcategories = await Subcategory.find();
      return res.status(200).json({ success: true, subcategories });
    }
  } catch (err) {
    console.error("Error getting subcategory:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error Check Console for more Details",
    });
  }
};

module.exports = {
  createsubCategory,
  getSubcategory,
};
