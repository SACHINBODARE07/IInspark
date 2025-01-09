const User = require('../models/User');

exports.getVideos = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ videos: user.progress.videos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addVideo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.progress.videos.push(req.body.video);
        await user.save();
        res.status(200).json({ message: 'Video added successfully' });
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
