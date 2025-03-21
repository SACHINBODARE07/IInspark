const { profile } = require('console');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');  
const nodemailer = require('nodemailer');
const Level = require('../models/Level');
const Product = require('../models/product');
const Video = require('../models/Video');

// Using memory storage 
const storage = multer.memoryStorage();
//
const path = require('path');

exports.signup = async (req, res) => {
    try {
      const { name, email, password, dateOfBirth, grade, subjects, schoolDetails } = req.body;
      if (!name || !email || !password || !dateOfBirth || !grade || !subjects || !schoolDetails) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user instance
      const newUser = new User({
        name,
        email,
        password: hashedPassword, // Use the hashed password
        dateOfBirth,
        grade,
        subjects,
        schoolDetails
      });

      // Save the user data to the database
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during signup:', error); // Log the error for debugging
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin, // Include isAdmin in the payload
      }
    };

    jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, name: user.name, isAdmin: user.isAdmin }); // Send isAdmin in the response
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyDocuments = (req, res) => {
    // Implementation for document verification
};

// Set up storage engine
// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

let upload = multer({
  //  storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'studentIdFront', maxCount: 1 },
    { name: 'studentIdBack', maxCount: 1 },
    { name: 'adharCardFront', maxCount: 1 },
    { name: 'adharCardBack', maxCount: 1 },
]);

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

exports.verifyDocuments = (req, res) => {
  upload(req, res, (err) => {
      if (err) {
          // Handle upload errors
          return res.status(400).json({ message: err });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
          // Handle case where no files are uploaded
          return res.status(400).json({ message: 'No files were uploaded.' });
      }

      // Respond with success and uploaded file details
      res.status(200).json({
          message: 'Files uploaded successfully.',
          files: req.files,
      });
  });
};
// exports.verifyDocuments = (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ msg: err });
//         }
        // Handle file verification
//         res.send('Files uploaded successfully');
//     });

//         res.send('Files uploaded successfully');
//     });


exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, grade, profileImage } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;
    // user.grade = grade;
    user.profileImage = profileImage;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.updateAccountInfo = async (req, res) => {
  try {
    const { profileName, email, grade } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.accountInfo.profileName = profileName;
    user.accountInfo.email = email;
    user.accountInfo.grade = grade;

    await user.save();

    res.status(200).json({ message: 'Account information updated successfully' });
  } catch (error) {
    console.error('Error during account info update:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error during password update:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = newEmail;

    await user.save();

    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Error during email update:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Load from .env
    pass: process.env.EMAIL_PASS, // Load from .env
  },
});

// Test Nodemailer connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer connection error:', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});
exports.sendOTP = async (req, res) => {
  try {
    const { email, newEmail } = req.body;

    // Validate emails
    if (!email || !newEmail) {
      return res.status(400).json({ message: "Email and new email are required" });
    }

    // Check if new email is already registered
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "New email is already registered" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 mins

    // Store OTP in the database (update existing user)
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send OTP Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: "Verify Your New Email - OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, newEmail } = req.body;

    if (!email || !otp || !newEmail) {
      return res.status(400).json({ message: "Email, OTP, and new email are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Debugging
    console.log(`Stored OTP: ${user.otp}, Entered OTP: ${otp}`);
    console.log(`OTP Expiry: ${new Date(user.otpExpiry)}, Current Time: ${new Date()}`);

    if (user.otp !== Number(otp) || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Ensure new email is not already registered
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "New email is already registered" });
    }

    // Update email directly after OTP verification
    user.email = newEmail;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// ✅ Send OTP for Login
exports.sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     // Generate OTP
     const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
     const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 mins

    // Save OTP and expiry time in the user document
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login OTP Code',
      text: `Your OTP for login is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to email. Please verify.' });
  } catch (error) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Verify OTP and Login
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid
    if (user.otp !== Number(otp) || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP and expiry time after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token for login
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ message: 'Login successful', token });
    });
  } catch (error) {
    console.error('Error verifying login OTP:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.sendOTPForPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
      const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 mins

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.verifyOTPAndUpdatePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Debugging
    console.log(`Stored OTP: ${user.otp}, Entered OTP: ${otp}`);
    console.log(`OTP Expiry: ${new Date(user.otpExpiry)}, Current Time: ${new Date()}`);

    if (user.otp !== Number(otp) || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error verifying OTP and updating password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Fetch all data for user
exports.getUserData = async (req, res) => {
  try {
    const levels = await Level.find({});
    const products = await Product.find({});
    const videos = await Video.find({});

    res.status(200).json({
      message: 'Data fetched successfully',
      levels,
      products,
      videos,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all levels
exports.getLevels = async (req, res) => {
  try {
    const levels = await Level.find({});
    res.status(200).json({ message: 'Levels fetched successfully', levels });
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ message: 'Products fetched successfully', products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).json({ message: 'Videos fetched successfully', videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};