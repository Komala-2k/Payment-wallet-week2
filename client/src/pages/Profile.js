import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Save as SaveIcon } from '@mui/icons-material';

const useStyles = styled((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

function Profile() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} container justifyContent="center">
            <Avatar className={classes.avatar}>JD</Avatar>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <form className={classes.form}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                defaultValue="John Doe"
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                defaultValue="john@example.com"
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                defaultValue="+1 234 567 8900"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                className={classes.submitButton}
              >
                Save Changes
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <form className={classes.form}>
              <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                className={classes.submitButton}
              >
                Update Password
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Profile;
