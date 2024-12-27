import React, { useState, useEffect } from 'react';
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
  Avatar,
  Paper,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  Search,
  ContactPhone,
  QrCode,
  History,
  Person,
  Close,
  Send,
  AccountCircle
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];

const SendMoney = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    receiverUpiId: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [searchMode, setSearchMode] = useState('upi'); // 'upi', 'contacts', 'qr'
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch all users for search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_ENDPOINTS.PROFILE.replace('/profile', '/users/list')}`,
          {
            headers: { 'x-auth-token': token }
          }
        );
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleQuickAmountSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      amount: value.toString()
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'receiverUpiId') {
      setSearchText(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear receiver details when UPI ID changes
    if (name === 'receiverUpiId') {
      setReceiverDetails(null);
      setError('');
    }
  };

  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      receiverUpiId: user.upiId
    }));
    setReceiverDetails(user);
    setSearchText(user.upiId);
    setError('');
  };

  // Filter users based on search text
  const filteredUsers = users.filter(user => {
    const searchLower = searchText.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.upiId.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.receiverUpiId || !formData.amount) {
      setError('Please enter receiver UPI ID and amount');
      return;
    }

    if (!receiverDetails) {
      setError('Please enter a valid receiver UPI ID');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.SEND_MONEY,
        {
          ...formData,
          amount: parseFloat(formData.amount)
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setLoading(false);
      onSuccess(response.data);
      onClose();
      
      // Reset form
      setFormData({
        receiverUpiId: '',
        amount: '',
        description: ''
      });
      setReceiverDetails(null);
      setSearchText('');
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Error sending money';
      setError(errorMessage);
      console.error('Error sending money:', err);
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
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2
        }}
      >
        <Typography variant="h6">Send Money</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <Paper
                  elevation={searchMode === 'upi' ? 3 : 1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: searchMode === 'upi' ? 'primary.light' : 'background.paper',
                    '&:hover': { bgcolor: 'primary.light' }
                  }}
                  onClick={() => setSearchMode('upi')}
                >
                  <Search sx={{ color: searchMode === 'upi' ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>UPI ID</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  elevation={searchMode === 'contacts' ? 3 : 1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: searchMode === 'contacts' ? 'primary.light' : 'background.paper',
                    '&:hover': { bgcolor: 'primary.light' }
                  }}
                  onClick={() => setSearchMode('contacts')}
                >
                  <ContactPhone sx={{ color: searchMode === 'contacts' ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>Contacts</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  elevation={searchMode === 'qr' ? 3 : 1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: searchMode === 'qr' ? 'primary.light' : 'background.paper',
                    '&:hover': { bgcolor: 'primary.light' }
                  }}
                  onClick={() => setSearchMode('qr')}
                >
                  <QrCode sx={{ color: searchMode === 'qr' ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>Scan QR</Typography>
                </Paper>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              placeholder="Search by name or UPI ID"
              name="receiverUpiId"
              value={searchText}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                sx: { borderRadius: 2 }
              }}
            />

            {searchText && !receiverDetails && (
              <Paper sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                <List>
                  {filteredUsers.map((user) => (
                    <ListItemButton 
                      key={user._id}
                      onClick={() => handleUserSelect(user)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AccountCircle />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={user.upiId}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}

            {receiverDetails && (
              <Paper sx={{ mt: 2, p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{receiverDetails.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {receiverDetails.upiId}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>

          {receiverDetails && (
            <>
              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                  Enter Amount
                </Typography>
                <TextField
                  fullWidth
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  variant="outlined"
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
                  Quick Amount
                </Typography>
                <Grid container spacing={1}>
                  {QUICK_AMOUNTS.map((value) => (
                    <Grid item xs={4} sm={2.4} key={value}>
                      <Button
                        fullWidth
                        variant={formData.amount === value.toString() ? "contained" : "outlined"}
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
                <TextField
                  fullWidth
                  label="Add a note (optional)"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            </>
          )}
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
            disabled={loading || !formData.receiverUpiId || !formData.amount || !receiverDetails}
            sx={{ 
              borderRadius: 2,
              py: 1.5
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <Send sx={{ mr: 1 }} />
                Pay ₹{formData.amount || '0'}
              </>
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SendMoney;
