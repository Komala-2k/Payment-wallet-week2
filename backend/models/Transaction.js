const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
transactionSchema.index({ sender: 1, timestamp: -1 });
transactionSchema.index({ receiver: 1, timestamp: -1 });
transactionSchema.index({ timestamp: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
