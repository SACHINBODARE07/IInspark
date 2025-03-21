const Level = require('../models/Level');
const Product = require('../models/product');
const Video = require('../models/Video');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getLevels = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ level: user.progress.level });
    } catch (error) {
        console.error('Error fetching levels:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateLevel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.progress.level = req.body.level;
        await user.save();
        res.status(200).json({ message: 'Level updated successfully' });
    } catch (error) {
        console.error('Error updating level:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Add a new product (Admin Only)
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, gender, imageUrl } = req.body;

    // Create a new product
    const newProduct = new Product({ name, description, price, category, gender, imageUrl });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new video (Admin Only)
exports.addVideo = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;

    // Create a new video
    const newVideo = new Video({ title, description, videoUrl });
    await newVideo.save();

    res.status(201).json({ message: 'Video added successfully', video: newVideo });
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch all users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Admin: Update User Grade
exports.updateGrade = async (req, res) => {
  try {
    const { userId } = req.params;
    const { grade } = req.body;

    if (!grade) {
      return res.status(400).json({ message: 'Grade is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.grade = grade;
    await user.save();

    res.status(200).json({ message: 'Grade updated successfully', grade: user.grade });
  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
