const mongoose = require('mongoose');
const Product = require('../models/product');

const dbURI = 'mongodb+srv://LearningApp:251536@cluster0.xgy0bwd.mongodb.net/learningApp';

mongoose.connect(dbURI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('MongoDB connected');

  const products = [
    {
      name: 'Super NOVA',
      description: 'AMOLED | BT Calling',
      price: 20330,
      category: 'Gadgets',
      gender: 'Male',
      imageUrl: 'url_to_super_nova_image'
    },
    {
      name: 'Phoenix AMOLED Ultra',
      description: 'AMOLED | BT Calling',
      price: 21330,
      category: 'Gadgets',
      gender: 'Female',
      imageUrl: 'url_to_phoenix_image'
    },
    // Add more products as needed
  ];

  await Product.insertMany(products);
  console.log('Products added successfully');
  mongoose.connection.close();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
