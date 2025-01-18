const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  socialMediaHandle: { type: String, required: true },
  images: [{ type: String }] // Array to store image paths
});

module.exports = mongoose.model('User', userSchema);
