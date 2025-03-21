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
        console.log("Request Body:", req.body);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (user.coins < product.price) {
            return res.status(400).json({ message: 'Not enough coins' });
        }

        user.coins -= product.price;
        await user.save();

        res.status(200).json({ message: 'Product purchased successfully' });
    } catch (error) {
        console.error('Error purchasing product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

