import { useEffect, useState } from 'react';
import API from '../utils/api';
import { Container, Typography, TextField, Button, MenuItem } from '@mui/material';
import Navbar from '../components/Navbar';

const UserDashboard = () => {
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        department: '',
        block_number: '',
        building_number: '',
        phone_number: ''
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await API.get('departments/');
                setDepartments(res.data);
            } catch (err) {
                console.error("Error fetching departments:", err);
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async () => {
        try {
            await API.post('complaints/', form);
            setForm({
                title: '',
                description: '',
                department: '',
                block_number: '',
                building_number: '',
                phone_number: ''
            });
            alert("Complaint submitted successfully.");
        } catch (err) {
            console.error("Error submitting complaint:", err.response?.data || err.message);
            alert("Submission failed. Check all fields and try again.");
        }
    };

    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h5" sx={{ mt: 2 }}>File Complaint</Typography>

                <TextField label="Title" fullWidth margin="normal" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <TextField label="Description" fullWidth multiline rows={3} margin="normal" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                <TextField select label="Department" fullWidth margin="normal" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    {departments.map((d) => (
                        <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                </TextField>

                <TextField label="Block Number" fullWidth margin="normal" value={form.block_number} onChange={(e) => setForm({ ...form, block_number: e.target.value })} />
                <TextField label="Building Number" fullWidth margin="normal" value={form.building_number} onChange={(e) => setForm({ ...form, building_number: e.target.value })} />
                <TextField label="Phone Number" fullWidth margin="normal" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />

                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Container>
        </>
    );
};

export default UserDashboard;
