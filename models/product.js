const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    gender: { type: String },
    imageUrl: { type: String, required: true }
});

// module.exports = mongoose.model('Product', ProductSchema);

module.exports = mongoose.models.Product || mongoose.model('product', ProductSchema);
