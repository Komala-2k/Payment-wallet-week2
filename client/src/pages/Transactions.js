import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CallReceived as ReceiveIcon,
  CallMade as SendIcon,
} from '@mui/icons-material';
import axios from 'axios';

const useStyles = styled((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  received: {
    color: theme.palette.success.main,
  },
  sent: {
    color: theme.palette.error.main,
  },
  amount: {
    fontWeight: 'bold',
  },
}));

function Transactions() {
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch transactions
    axios.get('/api/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Transaction History
        </Typography>
        <List>
          {transactions.map((transaction) => (
            <ListItem key={transaction.id} divider>
              <ListItemIcon>
                {transaction.type === 'credit' ? (
                  <ReceiveIcon className={classes.received} />
                ) : (
                  <SendIcon className={classes.sent} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={transaction.type === 'credit' ? 'Received' : 'Sent'}
                secondary={new Date(transaction.date).toLocaleDateString()}
              />
              <ListItemSecondaryAction>
                <Typography
                  className={classes.amount + ' ' + 
                    (transaction.type === 'credit' ? classes.received : classes.sent)
                  }
                >
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                </Typography>
                <Chip
                  size="small"
                  label="Completed"
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {transactions.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No transactions found"
                secondary="Your transaction history will appear here"
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default Transactions;
