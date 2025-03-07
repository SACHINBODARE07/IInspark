const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../controllers/authMiddleware');

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

module.exports = router;
