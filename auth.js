const express = require('express');
const router = express.Router();

// Temporary Register Route (Testing ke liye)
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({ message: '🎉 User registered successfully!', user: { name, email } });
});

// Temporary Login Route (Testing ke liye)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ message: '🎉 Login Successful!', user: { email } });
});

module.exports = router;