require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/Item");
const auth = require("./middleware/auth");
const cors = require("cors");

const app = express();
const port = 3001;
// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

const mongoURI = process.env.MONGO_URI;

// This code connects to your database
mongoose
  .connect(mongoURI)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((err) => console.error("Connection error:", err));

// Auth Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/api/seed", async (req, res) => {
  const sampleItems = [
    {
      name: "Classic Leather Wallet",
      price: 75.0,
      category: "Accessories",
      description: "A timeless wallet made from genuine leather.",
      imageUrl: "https://via.placeholder.com/200",
    },
    {
      name: "Wireless Bluetooth Headphones",
      price: 250.0,
      category: "Electronics",
      description: "High-fidelity sound with 20 hours of battery life.",
      imageUrl: "https://via.placeholder.com/200",
    },
    {
      name: "Modern Ceramic Mug",
      price: 25.5,
      category: "Home Goods",
      description: "A stylish and durable mug for your morning coffee.",
      imageUrl: "https://via.placeholder.com/200",
    },
  ];

  // First, delete any existing items to avoid duplicates
  await Item.deleteMany({});
  // Then, insert the new sample items
  const createdItems = await Item.insertMany(sampleItems);
  res.json(createdItems);
});

// This is our first API endpoint
app.get("/api/items", async (req, res) => {
  try {
    const filter = {}; // Start with an empty filter object

    // If a 'category' is provided in the URL query, add it to the filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Pass the filter object to the find() method
    const items = await Item.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

app.post("/api/items", auth, async (req, res) => {
  try {
    // Create a new item instance using the data from the request body
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
    });

    // Save the new item to the database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem); // Send back the created item with a 201 status
  } catch (error) {
    res.status(400).json({ message: "Error creating item", error: error });
  }
});

app.put("/api/items/:id", auth, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id, // The ID of the item to update
      req.body, // The new data for the item
      { new: true } // This option returns the updated document
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Error updating item", error: error });
  }
});

app.delete("/api/items/:id", auth, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error });
  }
});

// This starts the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
