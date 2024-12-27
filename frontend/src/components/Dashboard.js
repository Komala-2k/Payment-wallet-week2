import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  AccountBalanceWallet,
  Send,
  Add,
  AccountCircle,
  Logout,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SendMoney from './SendMoney';
import AddMoney from './AddMoney';
import TransactionHistory from './TransactionHistory';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [anchorEl, setAnchorEl] = useState(null);
  const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleTransactionSuccess = (data) => {
    setUser(prev => ({
      ...prev,
      balance: data.balance
    }));
    localStorage.setItem('user', JSON.stringify({
      ...user,
      balance: data.balance
    }));
  };

  const refreshBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5003/api/users/profile', {
        headers: { 'x-auth-token': token }
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <IconButton onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

        {/* Balance Card */}
        <Card sx={{ mb: 4, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="subtitle2">
                  Available Balance
                </Typography>
                <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                  ₹{user?.balance?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
              <IconButton 
                onClick={refreshBalance}
                sx={{ color: 'white' }}
              >
                <Refresh />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Send />}
              onClick={() => setSendMoneyOpen(true)}
              sx={{ height: '48px' }}
            >
              Send Money
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddMoneyOpen(true)}
              sx={{ height: '48px' }}
            >
              Add Money
            </Button>
          </Grid>
        </Grid>

        {/* Transaction History */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Transactions
          </Typography>
          <TransactionHistory />
        </Box>
      </Box>

      {/* Dialogs */}
      <SendMoney
        open={sendMoneyOpen}
        onClose={() => setSendMoneyOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      <AddMoney
        open={addMoneyOpen}
        onClose={() => setAddMoneyOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
    </Container>
  );
};

export default Dashboard;
