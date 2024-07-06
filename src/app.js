require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { json, urlencoded } = express;

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;
