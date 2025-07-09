import React from 'react';
import { Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Welcome to Happy Society</Typography>
        <Typography sx={{ mt: 2 }}>
          Please login or register to manage your complaints.
        </Typography>
      </Container>
    </>
  );
};

export default Home;
