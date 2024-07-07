require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { json, urlencoded } = express;
// const { swaggerUi, swaggerDocs } = require('./config/swagger');

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// Swagger setup
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;