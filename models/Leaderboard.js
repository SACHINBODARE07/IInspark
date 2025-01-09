const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    username: { type: String, required: true },
    score: { type: Number, required: true },
    region: { type: String, required: true }
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
