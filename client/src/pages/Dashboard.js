import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AccountBalance, TrendingUp, Payment } from '@mui/icons-material';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const BalanceIcon = styled(AccountBalance)(({ theme }) => ({
  fontSize: 48,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const BalanceText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch balance
    axios.get('/api/users/balance')
      .then(response => {
        setBalance(response.data.balance);
      })
      .catch(error => {
        console.error('Error fetching balance:', error);
      });

    // Fetch recent transactions
    axios.get('/api/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  return (
    <StyledContainer>
      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <BalanceIcon />
            <Typography variant="h6">Current Balance</Typography>
            <BalanceText variant="h3">
              ${balance.toFixed(2)}
            </BalanceText>
            <ActionButton
              variant="contained"
              color="primary"
              startIcon={<Payment />}
            >
              Add Money
            </ActionButton>
          </StyledPaper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<Payment />}
                >
                  Send Money
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<TrendingUp />}
                >
                  Request Money
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Box key={transaction.id} mb={2}>
                  <Typography>
                    {transaction.type === 'credit' ? 'Received' : 'Sent'}{' '}
                    ${transaction.amount}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">
                No recent transactions
              </Typography>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default Dashboard;
