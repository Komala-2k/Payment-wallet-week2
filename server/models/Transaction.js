const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['ADD_MONEY', 'SEND_MONEY'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least 1']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [100, 'Description cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
transactionSchema.index({ sender: 1, timestamp: -1 });
transactionSchema.index({ receiver: 1, timestamp: -1 });
transactionSchema.index({ status: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
