const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../controllers/authMiddleware');
const authAdmin = require('../middleware/authAdmin'); // Correct path

// Example admin route
router.get('/admin/dashboard', authAdmin, (_req, res) => {
  res.json({ msg: 'Welcome to the admin dashboard' });
});

// Admin routes
// router.post('/levels', isAdmin, adminController.addLevel);
// router.put('/levels/:levelNumber', isAdmin, adminController.updateLevel);
router.post('/products', isAdmin, adminController.addProduct);
router.post('/videos', isAdmin, adminController.addVideo);
router.get('/users', isAdmin, adminController.getAllUsers);


router.get('/levels', isAdmin, adminController.getLevels);
router.post('/updateLevel', isAdmin, adminController.updateLevel);


// Create admin credentials
router.post('/create-admin', adminController.createAdmin);

// Route to update user grade (Admin Only)
router.put('/updateGrade/:userId', isAdmin, adminController.updateGrade);

module.exports = router;