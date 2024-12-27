const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Transaction API is working!' });
});

// Get user details by UPI ID
router.get('/user/:upiId', auth, async (req, res) => {
  try {
    console.log('Searching for user with UPI ID:', req.params.upiId);
    const user = await User.findOne({ upiId: req.params.upiId });
    if (!user) {
      console.log('User not found with UPI ID:', req.params.upiId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Found user:', user.name);
    res.json({
      name: user.name,
      upiId: user.upiId,
      email: user.email
    });
  } catch (error) {
    console.error('Error in user lookup:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Add money to wallet
router.post('/add-money', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount } = req.body;
    console.log('Add money request:', { userId: req.user.userId, amount });
    
    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Please enter a valid amount (minimum ₹1)' });
    }

    // Find user and update balance
    const user = await User.findById(req.user.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }

    // Create transaction record
    const transaction = new Transaction({
      sender: user._id,
      type: 'ADD_MONEY',
      amount: parseFloat(amount),
      description: 'Added money to wallet',
      status: 'COMPLETED'
    });

    // Update user balance
    const newBalance = (user.balance || 0) + parseFloat(amount);
    user.balance = newBalance;
    console.log('Updating balance:', { oldBalance: user.balance - parseFloat(amount), newBalance });

    // Save both transaction and user update
    await Promise.all([
      transaction.save({ session }),
      user.save({ session })
    ]);

    await session.commitTransaction();
    console.log('Money added successfully:', { 
      userId: user._id,
      amount,
      newBalance: user.balance,
      transactionId: transaction._id
    });
    
    res.json({ 
      message: 'Money added successfully',
      balance: user.balance,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        timestamp: transaction.timestamp,
        status: transaction.status
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Add money error:', error);
    res.status(500).json({ message: 'Error adding money to wallet' });
  } finally {
    session.endSession();
  }
});

// Send money to another user
router.post('/send-money', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { receiverUpiId, amount, description } = req.body;
    console.log('Send money request:', { 
      senderId: req.user.userId,
      receiverUpiId,
      amount,
      description
    });

    if (!receiverUpiId || !amount || amount < 1) {
      return res.status(400).json({ message: 'Please provide valid receiver UPI ID and amount' });
    }

    // Find sender
    const sender = await User.findById(req.user.userId).session(session);
    if (!sender) {
      console.log('Sender not found:', req.user.userId);
      await session.abortTransaction();
      return res.status(404).json({ message: 'Sender not found' });
    }
    console.log('Sender found:', { name: sender.name, balance: sender.balance });

    // Check sufficient balance
    if (sender.balance < parseFloat(amount)) {
      console.log('Insufficient balance:', { required: amount, available: sender.balance });
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Find receiver by UPI ID
    const receiver = await User.findOne({ upiId: receiverUpiId }).session(session);
    if (!receiver) {
      console.log('Receiver not found:', receiverUpiId);
      await session.abortTransaction();
      return res.status(404).json({ message: 'Receiver not found' });
    }
    console.log('Receiver found:', { name: receiver.name });

    if (sender._id.toString() === receiver._id.toString()) {
      console.log('Self-transfer attempted');
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cannot send money to yourself' });
    }

    const transferAmount = parseFloat(amount);

    // Create transaction record
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      type: 'TRANSFER',
      amount: transferAmount,
      description: description || 'Money transfer',
      status: 'COMPLETED'
    });

    // Update balances
    sender.balance -= transferAmount;
    receiver.balance = (receiver.balance || 0) + transferAmount;

    console.log('Updating balances:', {
      senderOldBalance: sender.balance + transferAmount,
      senderNewBalance: sender.balance,
      receiverOldBalance: receiver.balance - transferAmount,
      receiverNewBalance: receiver.balance
    });

    // Save all updates
    await Promise.all([
      transaction.save({ session }),
      sender.save({ session }),
      receiver.save({ session })
    ]);

    await session.commitTransaction();
    console.log('Money sent successfully:', {
      transactionId: transaction._id,
      amount: transferAmount,
      sender: sender.name,
      receiver: receiver.name
    });

    res.json({
      message: 'Money sent successfully',
      balance: sender.balance,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        receiver: {
          name: receiver.name,
          upiId: receiver.upiId
        },
        timestamp: transaction.timestamp,
        status: transaction.status
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Send money error:', error);
    res.status(500).json({ message: 'Error sending money' });
  } finally {
    session.endSession();
  }
});

// Get transaction history
router.get('/history', auth, async (req, res) => {
  try {
    console.log('Fetching transaction history for user:', req.user.userId);
    const transactions = await Transaction.find({
      $or: [
        { sender: req.user.userId },
        { receiver: req.user.userId }
      ]
    })
    .sort({ timestamp: -1 })
    .populate('sender', 'name upiId')
    .populate('receiver', 'name upiId');

    console.log('Found transactions:', transactions.length);
    res.json(transactions);
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
});

module.exports = router;
