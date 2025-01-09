const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI || 'mongodb+srv://LearningApp:251536@cluster0.xgy0bwd.mongodb.net/learningApp';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
         });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;