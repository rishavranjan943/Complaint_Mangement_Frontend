import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import {
    Container, Typography, Card, CardContent, CardActions,
    TextField, MenuItem, Button, Grid
} from '@mui/material';
import Navbar from '../components/Navbar';

const StaffDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formMap, setFormMap] = useState({});  // Holds local status, comment, department

    useEffect(() => {
        fetchComplaints();
        fetchDepartments();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await API.get('complaints/');
            const data = res.data;
            setComplaints(data);

            const initialFormMap = {};
            data.forEach(c => {
                initialFormMap[c.id] = {
                    status: c.status,
                    department: c.department,
                    comment: c.comment || ''
                };
            });
            setFormMap(initialFormMap);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await API.get('departments/');
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (id, field, value) => {
        setFormMap(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const handleUpdate = async (id) => {
        try {
            await API.patch(`complaints/${id}/`, {
                status: formMap[id].status,
                department: formMap[id].department,
                comment: formMap[id].comment,
            });
            fetchComplaints();
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Update failed");
        }
    };

    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>All Complaints</Typography>
                <Grid container spacing={2}>
                    {complaints.map((c) => (
                        <Grid item xs={12} md={6} key={c.id}>
                            <Card sx={{ backgroundColor: '#f5f5f5' }}>
                                <CardContent>
                                    <Typography variant="h6">{c.title}</Typography>
                                    <Typography variant="body2">{c.description}</Typography>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        <strong>From:</strong> {c.user} | <strong>Dept:</strong> {c.department_name} | <strong>Status:</strong> {c.status}
                                    </Typography>

                                    <TextField
                                        select
                                        label="Update Status"
                                        fullWidth
                                        margin="normal"
                                        value={formMap[c.id]?.status || ''}
                                        onChange={(e) => handleChange(c.id, 'status', e.target.value)}
                                    >
                                        <MenuItem value="Open">Open</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Closed">Closed</MenuItem>
                                    </TextField>

                                    <TextField
                                        select
                                        label="Change Department"
                                        fullWidth
                                        margin="normal"
                                        value={formMap[c.id]?.department || ''}
                                        onChange={(e) => handleChange(c.id, 'department', e.target.value)}
                                    >
                                        {departments.map((d) => (
                                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        label="Staff Comment"
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={2}
                                        value={formMap[c.id]?.comment || ''}
                                        onChange={(e) => handleChange(c.id, 'comment', e.target.value)}
                                    />
                                    <Typography variant="body2">
                                        Block: {c.block_number} | Building: {c.building_number} | Phone: {c.phone_number}
                                    </Typography>

                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" onClick={() => handleUpdate(c.id)}>Update</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default StaffDashboard;
