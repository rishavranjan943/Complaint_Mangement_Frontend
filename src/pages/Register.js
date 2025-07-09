import { TextField, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', aadhar_number: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending form data:', form);
  
    try {
      await API.post('register/', form);
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err.response?.data || err);
      alert('Registration failed: ' + JSON.stringify(err.response?.data || err.message));
    }
  };
  

  return (
    <>
    <Navbar/>
    <Container maxWidth="xs">
      <Typography variant="h5" sx={{ mt: 4 }}>Register</Typography>
      {['username', 'email', 'password', 'aadhar_number'].map((f) => (
        <TextField key={f} fullWidth margin="normal" label={f} name={f}
          type={f === 'password' ? 'password' : 'text'} value={form[f]} onChange={handleChange} />
      ))}
      <Button variant="contained" fullWidth onClick={handleSubmit}>Register</Button>
    </Container>
    </>
  );
};

export default Register;
