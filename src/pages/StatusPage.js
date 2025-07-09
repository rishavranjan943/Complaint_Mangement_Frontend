import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Box,
  Stack
} from '@mui/material';
import Navbar from '../components/Navbar';

const statusColors = {
  pending: 'warning',
  in_progress: 'info',
  resolved: 'success',
};

const StatusPage = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('complaints/');
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Complaints
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {complaints.length === 0 ? (
          <Typography variant="body1">No complaints found.</Typography>
        ) : (
          <Stack spacing={2}>
            {complaints.map((c) => (
              <Card key={c.id} elevation={3}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{c.title}</Typography>
                    <Chip
                      label={c.status}
                      color={statusColors[c.status] || 'default'}
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                    {c.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Department: {c.department_name || 'N/A'} | Block: {c.block_number} | Building: {c.building_number}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Phone: {c.phone_number}
                  </Typography>
                  {c.comment && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Staff Comment:</strong> {c.comment}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
};

export default StatusPage;
