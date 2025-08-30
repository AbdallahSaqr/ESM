import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { employeesAPI, companiesAPI, departmentsAPI, fetcher, swrKeys } from '../../services/api.jsx';
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
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EmployeeList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    department: '',
    name: '',
    email: '',
    mobile_number: '',
    address: '',
    designation: '',
    employee_status: 'application_received'
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  // Fetch employees using SWR only if authenticated
  const { data: employeesResponse, error: fetchError, mutate } = useSWR(
    isAuthenticated ? swrKeys.employees : null, 
    fetcher
  );

  // Fetch companies and departments for the form
  const { data: companiesResponse } = useSWR(
    isAuthenticated ? swrKeys.companies : null, 
    fetcher
  );

  const { data: departmentsResponse } = useSWR(
    isAuthenticated ? swrKeys.departments : null, 
    fetcher
  );

  // Extract data from paginated responses
  const employees = employeesResponse?.results || [];
  const companies = companiesResponse?.results || [];
  const departments = departmentsResponse?.results || [];

  // Filter departments based on selected company
  const filteredDepartments = departments.filter(dept => 
    !formData.company || dept.company === parseInt(formData.company)
  );

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.company) {
      errors.company = 'Company is required';
    }
    
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.mobile_number.trim()) {
      errors.mobile_number = 'Mobile number is required';
    } else if (!/^\+?1?\d{9,15}$/.test(formData.mobile_number.trim())) {
      errors.mobile_number = 'Please enter a valid mobile number (e.g., +1234567890)';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      errors.address = 'Address must be at least 10 characters long';
    }
    
    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required';
    } else if (formData.designation.trim().length < 2) {
      errors.designation = 'Designation must be at least 2 characters long';
    }
    
    // Validate hired_on when status is hired
    if (formData.employee_status === 'hired' && !formData.hired_on) {
      errors.hired_on = 'Hired date is required when status is "Hired"';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (employee = null) => {
    if (!isAuthenticated) {
      setError('Please log in to manage employees.');
      return;
    }
    
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        company: employee.company,
        department: employee.department,
        name: employee.name,
        email: employee.email,
        mobile_number: employee.mobile_number,
        address: employee.address,
        designation: employee.designation,
        employee_status: employee.employee_status,
        hired_on: employee.hired_on || ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        company: '',
        department: '',
        name: '',
        email: '',
        mobile_number: '',
        address: '',
        designation: '',
        employee_status: 'application_received',
        hired_on: ''
      });
    }
    setOpenDialog(true);
    setError('');
    setFormErrors({});
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
    setFormData({
      company: '',
      department: '',
      name: '',
      email: '',
      mobile_number: '',
      address: '',
      designation: '',
      employee_status: 'application_received',
      hired_on: ''
    });
    setError('');
    setFormErrors({});
  };

  const handleCompanyChange = (companyId) => {
    setFormData({
      ...formData,
      company: companyId,
      department: '' // Reset department when company changes
    });
    // Clear department error when company changes
    if (formErrors.department) {
      setFormErrors({ ...formErrors, department: '' });
    }
  };

  const handleInputChange = (field, value) => {
    // Handle status change specially
    if (field === 'employee_status') {
      if (value === 'hired') {
        // Automatically set hired_on to today's date when status changes to "hired"
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        setFormData(prev => ({ ...prev, [field]: value, hired_on: today }));
      } else {
        // Clear hired_on when status is not "hired"
        setFormData(prev => ({ ...prev, [field]: value, hired_on: '' }));
      }
      // Clear any related errors
      if (formErrors[field] || formErrors.hired_on) {
        setFormErrors(prev => ({ ...prev, [field]: '', hired_on: '' }));
      }
    } else {
      // Normal field update
      setFormData({ ...formData, [field]: value });
      // Clear error for this field when user starts typing
      if (formErrors[field]) {
        setFormErrors({ ...formErrors, [field]: '' });
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingEmployee) {
        await employeesAPI.update(editingEmployee.id, formData);
      } else {
        await employeesAPI.create(formData);
      }
      mutate(); // Revalidate data
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeesAPI.delete(employeeId);
        mutate(); // Revalidate data
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'application_received': 'default',
      'interview_scheduled': 'warning',
      'hired': 'success',
      'not_accepted': 'error'
    };
    return colors[status] || 'default';
  };

  // Show authentication message if not logged in
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employees
        </Typography>
        <Alert severity="info">
          Please log in to view and manage employees.
        </Alert>
      </Container>
    );
  }

  // Show loading state
  if (!employeesResponse) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load employees: {fetchError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {employees.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No employees found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get started by adding your first employee.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {employees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {employee.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(employee)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(employee.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {employee.email}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {employee.designation}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={employee.employee_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      color={getStatusColor(employee.employee_status)}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEmployee ? 'Edit Employee' : 'Add Employee'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth error={!!formErrors.company}>
              <InputLabel>Company *</InputLabel>
              <Select
                value={formData.company}
                label="Company *"
                onChange={(e) => handleCompanyChange(e.target.value)}
                required
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.company && (
                <FormHelperText>{formErrors.company}</FormHelperText>
              )}
            </FormControl>
            
            <FormControl fullWidth error={!!formErrors.department}>
              <InputLabel>Department *</InputLabel>
              <Select
                value={formData.department}
                label="Department *"
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
                disabled={!formData.company}
              >
                {filteredDepartments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.department && (
                <FormHelperText>{formErrors.department}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              label="Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
            />
            
            <TextField
              fullWidth
              label="Mobile Number *"
              value={formData.mobile_number}
              onChange={(e) => handleInputChange('mobile_number', e.target.value)}
              placeholder="+1234567890"
              error={!!formErrors.mobile_number}
              helperText={formErrors.mobile_number}
              required
            />
            
            <TextField
              fullWidth
              label="Designation *"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              error={!!formErrors.designation}
              helperText={formErrors.designation}
              required
            />
            
            <TextField
              fullWidth
              label="Address *"
              multiline
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!formErrors.address}
              helperText={formErrors.address}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.employee_status}
                label="Status"
                onChange={(e) => handleInputChange('employee_status', e.target.value)}
              >
                <MenuItem value="application_received">Application Received</MenuItem>
                <MenuItem value="interview_scheduled">Interview Scheduled</MenuItem>
                <MenuItem value="hired">Hired</MenuItem>
                <MenuItem value="not_accepted">Not Accepted</MenuItem>
              </Select>
            </FormControl>
            
            {/* Show hired_on field only when status is "hired" */}
            {formData.employee_status === 'hired' && (
              <TextField
                fullWidth
                label="Hired Date *"
                type="date"
                value={formData.hired_on}
                onChange={(e) => handleInputChange('hired_on', e.target.value)}
                error={!!formErrors.hired_on}
                helperText={formErrors.hired_on}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEmployee ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeList;
