import { TextField, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import API from '../utils/api';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const { data } = await API.post('login/', form);
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('jwt', data.access);
        
        // Fetch user profile
        const profile = await API.get('me/', {
          headers: { Authorization: `Bearer ${data.access}` }
        });
        localStorage.setItem('role', profile.data.role);
        
        if (profile.data.role === 'admin') navigate('/admin-dashboard');
        else if (profile.data.role === 'staff') navigate('/staff');
        else navigate('/user');        
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert('Login failed: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <>
    <Navbar/>
    <Container maxWidth="xs">
      <Typography variant="h5" sx={{ mt: 4 }}>Login</Typography>
      <TextField fullWidth margin="normal" label="Username" name="username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <TextField fullWidth margin="normal" label="Password" type="password" name="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Button variant="contained" fullWidth onClick={handleSubmit}>Login</Button>
    </Container>
    </>
  );
};

export default Login;
