import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await API.post('token/', form);
      const token = res.data.access;
      localStorage.setItem('jwt', token);

      // Fetch user role
      const profile = await API.get('me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const role = profile.data.role;

      if (role === 'admin') {
        localStorage.setItem('role', 'admin');
        navigate('/admin-dashboard');
      } else {
        setError('You are not an admin.');
      }
    } catch (err) {
      setError('Invalid credentials or error logging in.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Admin Login</Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Login</Button>
    </Container>
  );
};

export default AdminLogin;
