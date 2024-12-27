import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { AccountBalance, CreditCard, Payment } from '@mui/icons-material';
import axios from 'axios';

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];
const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: <Payment /> },
  { id: 'card', name: 'Debit/Credit Card', icon: <CreditCard /> },
  { id: 'netbanking', name: 'Net Banking', icon: <AccountBalance /> },
];

const AddMoney = ({ open, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleQuickAmountSelect = (value) => {
    setAmount(value.toString());
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseInt(amount) < 1) {
      setError('Please enter a valid amount');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5003/api/transactions/add-money',
        { amount: parseInt(amount) },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setLoading(false);
      onSuccess(response.data);
      onClose();
      setAmount('');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error adding money');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          minHeight: fullScreen ? '100vh' : 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 2
      }}>
        Add Money to Wallet
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
              Enter Amount
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={amount}
              onChange={handleChange}
              type="number"
              required
              inputProps={{ min: 1 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                sx: { 
                  fontSize: '1.5rem',
                  textAlign: 'center'
                }
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
              Quick Add Amount
            </Typography>
            <Grid container spacing={1}>
              {QUICK_AMOUNTS.map((value) => (
                <Grid item xs={4} sm={2.4} key={value}>
                  <Button
                    fullWidth
                    variant={amount === value.toString() ? "contained" : "outlined"}
                    onClick={() => handleQuickAmountSelect(value)}
                    sx={{ 
                      borderRadius: 2,
                      py: 1
                    }}
                  >
                    ₹{value}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
              Payment Method
            </Typography>
            <Grid container spacing={2}>
              {PAYMENT_METHODS.map((method) => (
                <Grid item xs={12} key={method.id}>
                  <Paper
                    elevation={selectedMethod === method.id ? 3 : 1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      bgcolor: selectedMethod === method.id ? 'primary.light' : 'background.paper',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <IconButton
                      sx={{
                        color: selectedMethod === method.id ? 'primary.main' : 'text.secondary'
                      }}
                    >
                      {method.icon}
                    </IconButton>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: selectedMethod === method.id ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {method.name}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{ 
              borderRadius: 2,
              py: 1.5
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !amount}
            sx={{ 
              borderRadius: 2,
              py: 1.5
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Add ₹${amount || '0'}`
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMoney;
