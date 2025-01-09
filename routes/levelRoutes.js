const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');
const authMiddleware = require('../controllers/authMiddleware');

router.get('/levels', authMiddleware, levelController.getLevels);
router.post('/updateLevel', authMiddleware, levelController.updateLevel);

module.exports = router;
