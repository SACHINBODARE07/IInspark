const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
    levelNumber: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    options: [{ type: String }],
    videoUrl: { type: String },
    isLocked: { type: Boolean, default: true },
});

module.exports = mongoose.model('Level', LevelSchema);
