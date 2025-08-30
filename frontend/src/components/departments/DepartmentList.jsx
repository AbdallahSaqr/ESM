import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { departmentsAPI, fetcher, swrKeys } from '../../services/api.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const DepartmentList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '',
    company: ''
  });
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  // Fetch departments using SWR only if authenticated
  const { data: departmentsResponse, error: fetchError, mutate } = useSWR(
    isAuthenticated ? swrKeys.departments : null, 
    fetcher
  );

  // Fetch companies for the dropdown
  const { data: companiesResponse } = useSWR(
    isAuthenticated ? swrKeys.companies : null, 
    fetcher
  );

  // Extract arrays from the paginated responses
  const departments = departmentsResponse?.results || [];
  const companies = companiesResponse?.results || [];

  const handleOpenDialog = (department = null) => {
    if (!isAuthenticated) {
      setError('Please log in to manage departments.');
      return;
    }
    
    if (department) {
      setEditingDepartment(department);
      setFormData({ 
        name: department.name,
        company: department.company
      });
    } else {
      setEditingDepartment(null);
      setFormData({ 
        name: '',
        company: ''
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDepartment(null);
    setFormData({ 
      name: '',
      company: ''
    });
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (editingDepartment) {
        await departmentsAPI.update(editingDepartment.id, formData);
      } else {
        await departmentsAPI.create(formData);
      }
      mutate(); // Revalidate data
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentsAPI.delete(departmentId);
        mutate(); // Revalidate data
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Show authentication message if not logged in
  if (!isAuthenticated) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Departments
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please log in to view and manage departments.
          </Alert>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Sign In
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            color="primary"
            size="large"
          >
            Create Account
          </Button>
        </Box>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container>
        <Alert severity="error">Failed to load departments: {fetchError.message}</Alert>
      </Container>
    );
  }

  if (!departments) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Departments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Department
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {departments.map((department) => (
          <Grid item xs={12} sm={6} md={4} key={department.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {department.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(department)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(department.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`${department.number_of_employees} Employees`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={department.company_name}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to={`/departments/${department.id}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDepartment ? 'Edit Department' : 'Add Department'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Company</InputLabel>
            <Select
              value={formData.company}
              label="Company"
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            >
              {companies?.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDepartment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DepartmentList;
