import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  AccountBalance,
  DateRange,
  Edit,
  Logout,
  Home,
  AccountCircle,
  Phone
} from '@mui/icons-material';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);

        // Fetch latest user data from server
        const response = await axios.get('http://localhost:5003/api/users/profile', {
          headers: { 'x-auth-token': token }
        });
        
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  };

  if (loading || !user) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: isMobile ? 2 : 4 }}>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Avatar
              sx={{ 
                width: isMobile ? 100 : 150,
                height: isMobile ? 100 : 150,
                bgcolor: theme.palette.primary.main,
                fontSize: isMobile ? '2.5rem' : '3.5rem',
                mb: isMobile ? 2 : 0,
                mr: isMobile ? 0 : 4
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            
            <Typography variant="h4" sx={{ mt: 2 }}>
              {user.name}
            </Typography>

            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              display: 'inline-block'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                UPI ID
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em'
                }}
              >
                {user.upiId}
              </Typography>
            </Box>

            <Box sx={{ 
              mt: 4, 
              p: 3, 
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1
            }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AccountCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Username"
                        secondary={user.username}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={user.email}
                      />
                    </ListItem>

                    {user.phoneNumber && (
                      <ListItem>
                        <ListItemIcon>
                          <Phone color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone Number"
                          secondary={user.phoneNumber}
                        />
                      </ListItem>
                    )}
                    
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalance color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Current Balance"
                        secondary={`$${user.balance?.toFixed(2) || '0.00'}`}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <DateRange color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Member Since"
                        secondary={new Date(user.createdAt).toLocaleDateString()}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              <Box sx={{ 
                mt: 4, 
                display: 'flex', 
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2 
              }}>
                <Button
                  variant="contained"
                  startIcon={<Home />}
                  fullWidth={isMobile}
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Logout />}
                  fullWidth={isMobile}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
