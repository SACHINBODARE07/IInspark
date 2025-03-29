const Product = require('../models/product'); // Import the model
const User = require('../models/User');



exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, gender, imageUrl } = req.body;

    const newProduct = new Product({ name, description, price, category, gender, imageUrl });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.buyProduct = async (req, res) => {
    try {
        console.log("🔍 Incoming Request:");
        console.log("📝 Body:", req.body);
        console.log("🔎 Query:", req.query);
        console.log("📌 Headers:", req.headers);

        // Ensure req.user exists and extract user ID
        const userId = req.user?.id || req.body?.userId || req.query?.userId || req.headers['user-id'];
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract product ID from various sources for flexibility
        const productId = req.body?.productId || req.body?._id || req.query?.productId || req.headers['product-id'];

        console.log("🛒 Extracted Product ID:", productId);
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has enough coins
        if (user.coins < product.price) {
            return res.status(400).json({ message: "Not enough coins" });
        }

        // Deduct the product price from the user's coins
        user.coins -= product.price;
        await user.save();

        console.log(`✅ Purchase successful! User now has ${user.coins} coins remaining.`);

        return res.status(200).json({ 
            message: "Product purchased successfully", 
            remainingCoins: user.coins 
        });

    } catch (error) {
        console.error("❌ Error purchasing product:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
