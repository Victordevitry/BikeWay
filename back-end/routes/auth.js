const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as needed
const BikeRoute = require('../models/bike-route'); 

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password,username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
    console.log(error);
  }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create a session or token (for simplicity, we can just send back the user data)
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.delete('/delete/:email', async (req, res) => {
    const email = req.params.email;
  
    try {
      // Delete the user
      const user = await User.findOneAndDelete({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete all associated routes for the user
      await BikeRoute.deleteMany({ userEmail: email });
  
      res.status(200).json({ message: 'User and associated routes deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user and data', error });
    }
  });

module.exports = router;
