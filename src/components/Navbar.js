import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // This checks localStorage on each navigation change
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const storedRole = localStorage.getItem('role');
    setIsLoggedIn(!!token && storedRole !== null);
    setRole(storedRole || '');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Happy Society
        </Typography>

        <Box>
          {isLoggedIn ? (
            <>
              {role === 'user' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/user')}>Dashboard</Button>
                  <Button color="inherit" onClick={() => navigate('/status')}>Status</Button>
                </>
              )}
              {role === 'staff' && (
                <Button color="inherit" onClick={() => navigate('/staff')}>Staff Dashboard</Button>
              )}
              {role === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/admin-dashboard')}>Admin Dashboard</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              {/*<Button color="inherit" onClick={() => navigate('/register')}>Register</Button>*/}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
