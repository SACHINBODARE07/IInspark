const User = require('../models/User');

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

