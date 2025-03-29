const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../controllers/authMiddleware');
const { sendOTPForPasswordReset } = require("../controllers/userController");
const {  verifyOTPAndUpdatePassword } = require("../controllers/userController");

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/verifyDocuments', userController.verifyDocuments);

router.post('/updateProfile',authMiddleware, userController.updateProfile);
router.post('/updateAccountInfo',authMiddleware, userController.updateAccountInfo);
router.post('/updatePassword',authMiddleware, userController.updatePassword);
router.post('/updateEmail',authMiddleware, userController.updateEmail);
router.post('/sendOTP',authMiddleware, userController.sendOTP);
router.post('/verifyOTP',authMiddleware, userController.verifyOTP);
router.get("/user-profile", authMiddleware, userController.getUserProfile);
// New routes for login with OTP
router.post('/sendLoginOTP', userController.sendLoginOTP);
router.post('/verifyLoginOTP',  userController.verifyLoginOTP);
// Route to send OTP for password reset
router.post("/sendOTPForPasswordReset",authMiddleware, sendOTPForPasswordReset);

// Route to verify OTP and update password
router.post("/verifyOTPAndUpdatePassword",authMiddleware, verifyOTPAndUpdatePassword);

router.get('/getUserData ', authMiddleware, userController.getUserData );

// Fetch user's grade
router.get('/getGrade', authMiddleware, userController.getUserGrade);


// 🎮 **User Coins, Profile Level, and Leaderboard APIs**
router.put('/updateCoins', authMiddleware, userController.updateCoins);
router.put('/updateProfileLevel', authMiddleware, userController.updateProfileLevel);
router.put('/updateLeaderboard', authMiddleware, userController.updateLeaderboard);
router.get('/getUserData',authMiddleware, userController.getUserData);

// User-side routes
router.get('/levels', authMiddleware, userController.getLevels);
router.get('/products', authMiddleware, userController.getProducts);
router.get('/videos', authMiddleware, userController.getVideos);

module.exports = router;
