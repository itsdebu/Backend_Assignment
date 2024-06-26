const Item = require("../models/itemModels");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subcategoryModel");

const createItem = async (req, res) => {
  try {
    // Extract item details from request body
    const { name, img, desc, baseAmount, discount, totalAmount } = req.body;

    if (!name || !img || !desc || !baseAmount || !discount || !totalAmount) {
      return res
        .status(400)
        .json({ error: "All the required field should be there." });
    }

    let { categoryId, subcategoryId } = req.body;

    if (!categoryId && !subcategoryId) {
      return res
        .status(400)
        .json({ error: "Parent id for subcategory or category is missing" });
    }

    // Initialize variables to store tax details
    let taxApplicable, taxPercentage;

    // Fetch tax details from category if categoryId is provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      taxApplicable = category.taxApplicable;
      taxPercentage = category.taxPercentage;
    }

    // If subcategoryId is provided, fetch tax details from subcategory
    if (subcategoryId) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      taxApplicable = subcategory.taxApplicable;
      taxPercentage = subcategory.taxPercentage;
      // Update categoryId if not provided in the request body
      if (!categoryId) {
        categoryId = subcategory.category;
      }
    }

    // Create a new item instance
    const newItem = new Item({
      name,
      img,
      desc,
      taxApplicable,
      taxPercentage,
      baseAmount,
      discount,
      totalAmount,
      category: categoryId || null,
      subcategory: subcategoryId || null,
    });

    // Save the new item to the database
    const createdItem = await newItem.save();

    // Return success response with the created item
    res.status(201).json({ success: true, item: createdItem });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error Check Console for more Details",
    });
  }
};

const getItems = async (req, res) => {
  try {
    const { catId, subId, itemId, itemname } = req.query;
    let items;

    if (catId) {
      items = await Item.find({ category: catId });
    } else if (subId) {
      items = await Item.find({ subcategory: subId });
    } else if (itemId) {
      items = await Item.findById(itemId);
    } else if (itemname) {
      // Identifier is a string, assume it's a name
      items = await Item.find({
        name: { $regex: itemname, $options: "i" },
      });
    } else {
      // No specific filter, fetch all items
      items = await Item.find();
    }

    if (!items) {
      return res.status(404).json({ success: false, error: "Items not found" });
    }

    res.status(200).json({ success: true, items });
  } catch (err) {
    console.error("Error getting items:", err);
    res.status(500).json({
      error: "Internal Server Error Check Console for more Details",
    });
  }
};

const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, img, desc } = req.body;

    if (!name && !img && !desc) {
      return res
        .status(400)
        .json({ success: true, message: "There's nothing to update" });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    if (name) {
      item.name = name;
    }
    if (img) {
      item.img = img;
    }
    if (desc) {
      item.desc = desc;
    }
    const updatedItem = await item.save();

    return res.status(200).json({
      success: true,
      message: "Item Updated Successfully",
      updatedItem,
    });
  } catch (err) {
    console.error("Error updating item:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error. Check Log for more details.",
    });
  }
};

module.exports = { createItem, getItems, editItem };
