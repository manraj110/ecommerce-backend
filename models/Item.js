const mongoose = require("mongoose");
const { Schema } = mongoose;

// This is the blueprint for each item in our database
const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: String,
  },
  { timestamps: true }
); // Automatically adds 'createdAt' and 'updatedAt' fields

// The model is the tool we use to interact with the 'items' collection
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
