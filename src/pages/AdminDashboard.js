import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Tabs, Tab, Box, TextField,
  Button, MenuItem, Divider, Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import API from '../utils/api';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [userForm, setUserForm] = useState({ username: '', email: '', password: '', aadhar_number: '', role: 'user' });
  const [deptForm, setDeptForm] = useState({ name: '' });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  const [editComplaint, setEditComplaint] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', description: '', status: '',
    block_number: '', building_number: '', phone_number: '',
    department: '', comment: ''
  });

  const fetchAll = async () => {
    try {
      const [u, d, c] = await Promise.all([
        API.get('users/'),
        API.get('departments/'),
        API.get('complaints/')
      ]);
      setUsers(u.data);
      setDepartments(d.data);
      setComplaints(c.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUserSubmit = async () => {
    try {
      if (selectedUser) {
        const updatedData = { ...userForm };
        if (!updatedData.password) delete updatedData.password;
        await API.put(`users/${selectedUser.id}/`, updatedData);
      } else {
        await API.post('users/', userForm);
      }
      setUserForm({ username: '', email: '', password: '', aadhar_number: '', role: 'user' });
      setSelectedUser(null);
      fetchAll();
    } catch (err) {
      alert("User error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      password: '',
      aadhar_number: user.aadhar_number || '',
      role: user.role
    });
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      await API.delete(`users/${id}/`);
      fetchAll();
    }
  };

  const handleDeptSubmit = async () => {
    try {
      if (selectedDept) {
        await API.put(`departments/${selectedDept.id}/`, deptForm);
      } else {
        await API.post('departments/', deptForm);
      }
      setDeptForm({ name: '' });
      setSelectedDept(null);
      fetchAll();
    } catch (err) {
      alert("Department error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleEditDept = (dept) => {
    setSelectedDept(dept);
    setDeptForm({ name: dept.name });
  };

  const handleDeleteDept = async (id) => {
    if (window.confirm("Delete this department?")) {
      await API.delete(`departments/${id}/`);
      fetchAll();
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm("Delete this complaint?")) {
      await API.delete(`complaints/${id}/`);
      fetchAll();
    }
  };

  const handleEditClick = (complaint) => {
    setEditComplaint(complaint);
    setEditForm({
      title: complaint.title,
      description: complaint.description,
      status: complaint.status || 'Open',
      block_number: complaint.block_number || '',
      building_number: complaint.building_number || '',
      phone_number: complaint.phone_number || '',
      department: complaint.department || '',
      comment: complaint.comment || ''
    });
  };

  const handleUpdateComplaint = async () => {
    try {
      await API.patch(`complaints/${editComplaint.id}/`, {
        ...editForm,
        user: editComplaint.user, // include existing user ID
      });
      setEditComplaint(null);
      fetchAll();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Update failed: " + JSON.stringify(error.response?.data || error.message));
    }
  };
  
  

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ my: 2 }}>
          <Tab label="Manage Users" />
          <Tab label="Manage Departments" />
          <Tab label="Manage Complaints" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Typography variant="h6">{selectedUser ? "Edit User/Staff" : "Add User/Staff"}</Typography>
            <TextField fullWidth margin="normal" label="Username" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} />
            <TextField fullWidth margin="normal" label="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
            <TextField fullWidth margin="normal" label="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
            <TextField fullWidth margin="normal" label="Aadhar Number" value={userForm.aadhar_number} onChange={(e) => setUserForm({ ...userForm, aadhar_number: e.target.value })} />
            <TextField fullWidth select label="Role" margin="normal" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </TextField>
            <Button variant="contained" onClick={handleUserSubmit}>{selectedUser ? "Update" : "Add"} User</Button>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6">All Users</Typography>
            {users.map(u => (
              <Card key={u.id} sx={{ my: 1 }}>
                <CardContent>
                  <Typography>{u.username} ({u.email})</Typography>
                  <Typography variant="caption">Role: {u.role}</Typography>
                  <IconButton onClick={() => handleEditUser(u)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteUser(u.id)}><Delete /></IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="h6">{selectedDept ? "Edit Department" : "Add Department"}</Typography>
            <TextField fullWidth margin="normal" label="Department Name" value={deptForm.name} onChange={(e) => setDeptForm({ name: e.target.value })} />
            <Button variant="contained" onClick={handleDeptSubmit}>{selectedDept ? "Update" : "Add"} Department</Button>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6">All Departments</Typography>
            {departments.map(d => (
              <Card key={d.id} sx={{ my: 1 }}>
                <CardContent>
                  <Typography>{d.name}</Typography>
                  <IconButton onClick={() => handleEditDept(d)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteDept(d.id)}><Delete /></IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Typography variant="h6">All Complaints</Typography>
            {complaints.map(c => (
              <Card key={c.id} sx={{ my: 1 }}>
                <CardContent>
                  <Typography><strong>{c.title}</strong> - {c.status}</Typography>
                  <Typography>{c.description}</Typography>
                  <Typography variant="caption">Filed by: {c.user_name} | Dept: {c.department_name}</Typography>
                  <IconButton onClick={() => handleEditClick(c)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteComplaint(c.id)}><Delete /></IconButton>
                </CardContent>
              </Card>
            ))}

            {/* Complaint Edit Dialog */}
            <Dialog open={!!editComplaint} onClose={() => setEditComplaint(null)}>
              <DialogTitle>Edit Complaint</DialogTitle>
              <DialogContent>
                <TextField fullWidth margin="normal" label="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                <TextField fullWidth margin="normal" label="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                <TextField select fullWidth margin="normal" label="Status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </TextField>
                <TextField fullWidth margin="normal" label="Block Number" value={editForm.block_number} onChange={(e) => setEditForm({ ...editForm, block_number: e.target.value })} />
                <TextField fullWidth margin="normal" label="Building Number" value={editForm.building_number} onChange={(e) => setEditForm({ ...editForm, building_number: e.target.value })} />
                <TextField fullWidth margin="normal" label="Phone Number" value={editForm.phone_number} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} />
                <TextField fullWidth margin="normal" label="Comment" multiline rows={2} value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })} />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditComplaint(null)}>Cancel</Button>
                <Button variant="contained" onClick={handleUpdateComplaint}>Update</Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Container>
    </>
  );
};

export default AdminDashboard;
