import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const Login = () => {
    console.log('Login component rendered');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Username: ${username}, Password: ${password}`);
    };

    return (
        <div>
            <h1>Login</h1>
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
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;