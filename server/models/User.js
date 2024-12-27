const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, and hyphens']
  },
  upiId: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  }
});

// Generate username from email if not provided
userSchema.pre('validate', function(next) {
  if (!this.username) {
    // Extract username from email (part before @)
    const emailUsername = this.email.split('@')[0];
    // Remove special characters and spaces
    this.username = emailUsername.replace(/[^a-zA-Z0-9]/g, '');
    
    // Add random numbers if username is too short
    if (this.username.length < 3) {
      this.username += Math.random().toString().substring(2, 5);
    }
    
    // Truncate if too long
    if (this.username.length > 30) {
      this.username = this.username.substring(0, 30);
    }
  }
  
  // Generate UPI ID
  this.upiId = `${this.username}@digitalwallet`;
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ upiId: 1 });
userSchema.index({ phoneNumber: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
