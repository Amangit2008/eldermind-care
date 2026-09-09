const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. App initialization
const app = express();

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. Root Route (Taaki browser par "Cannot GET /" na aaye)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 ElderMind Care API is running successfully!"
  });
});

// 4. Temporary Inline Auth Routes (Fixes 'Cannot find module' error)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register request received:', req.body);
  res.status(201).json({ message: '🎉 User registered successfully!', user: { name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', req.body);
  res.status(200).json({ message: '🎉 Login Successful!', user: { email } });
});

// 5. Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sih_db';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
});