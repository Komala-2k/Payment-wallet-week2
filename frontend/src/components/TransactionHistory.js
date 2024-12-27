import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  CallMade,
  CallReceived,
  AccountBalance
} from '@mui/icons-material';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5003/api/transactions/history',
        {
          headers: { 'x-auth-token': token }
        }
      );
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching transactions');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTransactionIcon = (type, isReceiver) => {
    if (type === 'ADD_MONEY') return <AccountBalance color="primary" />;
    return isReceiver ? 
      <CallReceived sx={{ color: theme.palette.success.main }} /> : 
      <CallMade sx={{ color: theme.palette.error.main }} />;
  };

  const getTransactionColor = (type, isReceiver) => {
    if (type === 'ADD_MONEY') return theme.palette.primary.main;
    return isReceiver ? theme.palette.success.main : theme.palette.error.main;
  };

  const getTransactionAmount = (transaction) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isReceiver = transaction.receiver?.upiId === user.upiId;
    const sign = isReceiver ? '+' : '-';
    return `${sign}₹${transaction.amount}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="textSecondary">
          No transactions yet
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ mt: 2 }}>
      <List>
        {transactions.map((transaction) => {
          const user = JSON.parse(localStorage.getItem('user'));
          const isReceiver = transaction.receiver?.upiId === user.upiId;
          
          return (
            <ListItem
              key={transaction.id}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 }
              }}
            >
              <ListItemIcon>
                {getTransactionIcon(transaction.type, isReceiver)}
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">
                      {transaction.type === 'ADD_MONEY' 
                        ? 'Added Money'
                        : isReceiver 
                          ? `From: ${transaction.sender.name}`
                          : `To: ${transaction.receiver.name}`
                      }
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ 
                        fontWeight: 'medium',
                        color: getTransactionColor(transaction.type, isReceiver)
                      }}
                    >
                      {getTransactionAmount(transaction)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(transaction.timestamp)}
                    </Typography>
                    {transaction.description && (
                      <Typography variant="caption" color="textSecondary">
                        {transaction.description}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default TransactionHistory;
