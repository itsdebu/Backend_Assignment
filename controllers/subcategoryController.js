const Subcategory = require("../models/subcategoryModel");

const createsubCategory = async (req, res) => {
  try {
    // Extract data from request body
    const {
      name,
      img,
      desc,
      taxApplicable,
      taxPercentage,
      taxType,
      categoryId,
    } = req.body;

    // Create a new subcategory instance
    const newSubcategory = new Subcategory({
      name,
      img,
      desc,
      taxApplicable,
      taxPercentage,
      taxType,
      category: categoryId,
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
    const { subname, subid, catid } = req.query;
    let subcategories;

    // Check if any of the query parameters exist
    if (subname) {
      // Query by subcategory name
      subcategories = await Subcategory.find({
        name: { $regex: subname, $options: "i" },
      });
    } else if (subid) {
      // Query by subcategory ID
      subcategories = await Subcategory.findById(subid);
    } else if (catid) {
      // Query by category ID
      subcategories = await Subcategory.find({ category: catid });
    } else {
      // No specific query, fetch all subcategories
      subcategories = await Subcategory.find();
    }

    // Check if subcategory found
    if (!subcategories) {
      return res
        .status(404)
        .json({ success: false, error: "Subcategory not found" });
    }

    // Return subcategory(s) in response
    return res.status(200).json({ success: true, subcategories });
  } catch (err) {
    console.error("Error getting subcategory:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error Check Console for more Details",
    });
  }
};

const editSubcategory = async (req, res) => {
  try {
    const subId = req.params.subId;
    const { name, img, desc } = req.body;

    if (!name && !img && !desc) {
      return res
        .status(400)
        .json({ success: true, message: "There's nothing to update" });
    }

    const subcategory = await Subcategory.findById(subId);

    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, error: "Subcategory not found" });
    }

    if (name) {
      subcategory.name = name;
    }
    if (img) {
      subcategory.img = img;
    }
    if (desc) {
      subcategory.desc = desc;
    }

    const updatedSubcategory = await subcategory.save();

    return res.status(200).json({
      success: true,
      message: "Subcategory Updated Successfully",
      updatedSubcategory,
    });
  } catch (err) {
    console.error("Error updating subcategory:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error. Check Log for more details.",
    });
  }
};

module.exports = {
  createsubCategory,
  getSubcategory,
  editSubcategory,
};
