const express = require('express');
const multer = require('multer');
const path = require('path');
const { createUser } = require('../controllers/userController'); // Import controller
const User = require('../models/User');
const router = express.Router();

// Set up file storage for images using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + Math.floor(Math.random() * 1000) + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage }); // For handling image uploads

// Route for creating a user with controller logic
router.post('/users', upload.array('images', 5), createUser);

// Additional POST route to handle submissions without `/users` path
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    if (images.length === 0) {
      return res.status(400).send('At least one image is required');
    }

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({
      name,
      socialMediaHandle,
      images,
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send('Error uploading data');
  }
});

// Fetch all users for admin dashboard
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
