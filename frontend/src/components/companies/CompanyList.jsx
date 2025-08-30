import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { companiesAPI, fetcher, swrKeys } from '../../services/api.jsx';
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
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CompanyList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  // Fetch companies using SWR only if authenticated
  const { data: companiesResponse, error: fetchError, mutate } = useSWR(
    isAuthenticated ? swrKeys.companies : null, 
    fetcher
  );

  // Extract companies array from the paginated response
  const companies = companiesResponse?.results || [];

  const handleOpenDialog = (company = null) => {
    if (!isAuthenticated) {
      setError('Please log in to manage companies.');
      return;
    }
    
    if (company) {
      setEditingCompany(company);
      setFormData({ name: company.name });
    } else {
      setEditingCompany(null);
      setFormData({ name: '' });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
    setFormData({ name: '' });
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (editingCompany) {
        await companiesAPI.update(editingCompany.id, formData);
      } else {
        await companiesAPI.create(formData);
      }
      mutate(); // Revalidate data
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companiesAPI.delete(companyId);
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
            Companies
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please log in to view and manage companies.
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
        <Alert severity="error">Failed to load companies: {fetchError.message}</Alert>
      </Container>
    );
  }

  if (!companiesResponse) {
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
          Companies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Company
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {companies.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No companies found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by adding your first company to the system.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {companies.map((company) => (
          <Grid item xs={12} sm={6} md={4} key={company.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {company.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(company)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(company.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`${company.number_of_departments} Departments`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`${company.number_of_employees} Employees`}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to={`/companies/${company.id}`}
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
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCompany ? 'Edit Company' : 'Add Company'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Company Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCompany ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompanyList;
