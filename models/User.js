const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    grade: { type: String, required: true },
    subjects: [String],
    schoolDetails: {
        state: String,
        district: String,
        mandal: String,
        schoolName: String,
    },
    documents: {
    studentIdFront: String,
    studentIdBack: String,
    adharCardFront: String,
    adharCardBack: String,
    },
    profileImage: String,
    profileLevel: { type: Number, default: 1 },
    coins: { type: Number, default: 0 },
    skills: [String],
    language: String,
    accountInfo: {
      profileName: String,
      email: String,
      grade: String,
    },
    progress: {
      level: { type: Number, default: 1 },
      videos: [String],
  },
  leaderboardScore: { type: Number, default: 0 }
});
UserSchema.index({ email: 1 }, { unique: true }); // Example index
module.exports = mongoose.model('User', UserSchema);
