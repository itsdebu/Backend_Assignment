const Item = require("../models/itemModels");

const createItem = async (req, res) => {
  try {
    // Extract item details from request body
    const {
      name,
      image,
      description,
      taxApplicable,
      taxPercentage,
      baseAmount,
      discount,
      totalAmount,
      categoryId,
      subcategoryId,
    } = req.body;

    // Create a new item instance
    const newItem = new Item({
      name,
      image,
      description,
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
