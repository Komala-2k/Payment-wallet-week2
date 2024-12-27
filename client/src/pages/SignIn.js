// client/src/pages/SignIn.js
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Example usage of the spread operator
    const userCredentials = { ...{ username, password, confirmPassword } };
    // Call API to create new user
    // For now, just log the user credentials to the console
    console.log(userCredentials);
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Sign In
        </Button>
      </form>
    </div>
  );
};


export default SignIn;


