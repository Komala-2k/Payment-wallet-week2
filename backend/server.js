const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Digital Wallet API is running' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
