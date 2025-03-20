const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../controllers/authMiddleware');


router.get('/videos', authMiddleware, videoController.getVideos);
router.post('/addVideo', authMiddleware, videoController.addVideo);


module.exports = router;
