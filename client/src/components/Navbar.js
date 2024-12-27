import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const StyledTitle = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <StyledTitle variant="h6">
          Digital Wallet
        </StyledTitle>
        <NavButton
          color="inherit"
          component={RouterLink}
          to="/"
          startIcon={<DashboardIcon />}
        >
          Dashboard
        </NavButton>
        <NavButton
          color="inherit"
          component={RouterLink}
          to="/send"
          startIcon={<PaymentIcon />}
        >
          Send Money
        </NavButton>
        <NavButton
          color="inherit"
          component={RouterLink}
          to="/transactions"
          startIcon={<HistoryIcon />}
        >
          Transactions
        </NavButton>
        <NavButton
          color="inherit"
          component={RouterLink}
          to="/profile"
          startIcon={<PersonIcon />}
        >
          Profile
        </NavButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
