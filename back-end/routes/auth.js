const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as needed
const BikeRoute = require('../models/bike-route');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

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

    // Exclude the password from the user object
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Send the user data back without the password
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// In your backend API routes file
/*
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Retrieve user data including the password (anonymized or hashed)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

*/


router.post('/saveAddress', async (req, res) => {
  try {
    const { email, type, address } = req.body;

    if (!['home', 'work'].includes(type)) {
      return res.status(400).json({ message: "Address type must be 'home' or 'work'" });
    }

    const updateField = type === 'home' ? { homeAddress: address } : { workAddress: address };

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateField },
      { new: true } // Option pour renvoyer le document mis à jour
    );

    if (updatedUser) {
      res.status(200).json({ message: 'Address updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Error updating address', error });
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
