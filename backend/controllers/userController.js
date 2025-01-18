const User = require('../models/User');

// Create a new user
const createUser = async (req, res) => {
    try {
      const { name, socialMediaHandle } = req.body;
  
      // Extract and validate uploaded images
      const images = req.files.map(file => file.filename);
      if (!images.length) {
        return res.status(400).json({ message: "No images uploaded." });
      }
  
      // Check for duplicate user by name
      const existingUser = await User.findOne({ name });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
  
      // Clear any previous images and append new ones
      const newUser = new User({
        name,
        socialMediaHandle,
        images,  
      });
  
      await newUser.save();
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error saving user data.' });
    }
  };
  
  
  // Fetch all users (for admin dashboard)
  const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users.' });
    }
  };
  
// Export controller functions
module.exports = {
  createUser,
  getUsers,
};
