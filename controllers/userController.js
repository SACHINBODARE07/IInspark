const { profile } = require('console');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');  
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
        name: user.name, // Include the user's name in the payload
        coins: user.coins // Include the user's coins in the payload
      }
    };

    jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, name: user.name }); // Send the token and name in the response
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

exports.sendOTP = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 300000; // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    // Send OTP to new email address
    //...

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error during OTP send:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp!== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.email = req.body.newEmail;

    await user.save();

    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id).select('name profileImage level coins');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      profileImage: user.profileImage,
      level : user.level,
      coins: user.coins
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

