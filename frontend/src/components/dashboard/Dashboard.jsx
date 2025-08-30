import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useSWR from 'swr';
import { fetcher, swrKeys } from '../../services/api.jsx';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Business,
  People,
  BusinessCenter,
  Add,
  Settings,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  // Fetch statistics only when authenticated
  const { data: companyStats, error: companyStatsError } = useSWR(
    isAuthenticated ? swrKeys.companyStats : null,
    fetcher
  );

  const { data: departmentStats, error: departmentStatsError } = useSWR(
    isAuthenticated ? swrKeys.departmentStats : null,
    fetcher
  );

  const { data: employeeStats, error: employeeStatsError } = useSWR(
    isAuthenticated ? swrKeys.employeeStats : null,
    fetcher
  );

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Welcome Header */}
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Employee Management System
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Streamline your organization's workforce management
              </Typography>
            </Paper>
          </Grid>
          
          {/* Feature Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Business sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Company Management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Create and manage multiple companies with comprehensive oversight
                </Typography>
                <Button variant="contained" color="primary" size="large" href="/companies" fullWidth>
                  Manage Companies
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <BusinessCenter sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Department Organization
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Organize departments within companies for better structure
                </Typography>
                <Button variant="contained" color="secondary" size="large" href="/departments" fullWidth>
                  Manage Departments
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <People sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Employee Tracking
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Track employee information, status, and performance
                </Typography>
                <Button variant="contained" color="success" size="large" href="/employees" fullWidth>
                  Manage Employees
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Authentication Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Get Started
              </Typography>
            </Divider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
              <DashboardIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Already have an account?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Log in to access your dashboard and manage your organization.
              </Typography>
              <Button variant="contained" color="primary" size="large" href="/login" fullWidth>
                Log In
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
              <Add sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                New to the system?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create an account to get started with employee management.
              </Typography>
              <Button variant="contained" color="secondary" size="large" href="/register" fullWidth>
                Register
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  const isLoading = !companyStats && !companyStatsError && !departmentStats && !departmentStatsError && !employeeStats && !employeeStatsError;
  const hasError = companyStatsError || departmentStatsError || employeeStatsError;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, backgroundColor: 'primary.main', color: 'white', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Welcome back, {user?.first_name || 'User'}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Here's an overview of your organization
                </Typography>
              </Box>
              <DashboardIcon sx={{ fontSize: 80, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>

        {/* Statistics Section Header */}
        <Grid item xs={12}>
          <Divider sx={{ my: 4 }}>
            <Typography variant="h6" color="white">
              Organization Statistics
            </Typography>
          </Divider>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Business sx={{ fontSize: 50, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {isLoading ? <CircularProgress size={30} /> : companyStats?.total_companies || 0}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Total Companies
                  </Typography>
                </Box>
              </Box>
              {companyStats && (
                <Chip 
                  label={`${companyStats.active_companies || 0} Active`} 
                  color="success" 
                  size="medium" 
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                variant="contained" 
                color="primary" 
                href="/companies" 
                fullWidth 
                size="large"
                startIcon={<Settings />}
              >
                Manage Companies
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessCenter sx={{ fontSize: 50, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {isLoading ? <CircularProgress size={30} /> : departmentStats?.total_departments || 0}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Total Departments
                  </Typography>
                </Box>
              </Box>
              {departmentStats && (
                <Chip 
                  label={`${departmentStats.active_departments || 0} Active`} 
                  color="success" 
                  size="medium" 
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                href="/departments" 
                fullWidth 
                size="large"
                startIcon={<Settings />}
              >
                Manage Departments
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <People sx={{ fontSize: 50, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {isLoading ? <CircularProgress size={30} /> : employeeStats?.total_employees || 0}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Total Employees
                  </Typography>
                </Box>
              </Box>
              {employeeStats && (
                <Chip 
                  label={`${employeeStats.active_employees || 0} Active`} 
                  color="success" 
                  size="medium" 
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                variant="contained" 
                color="success" 
                href="/employees" 
                fullWidth 
                size="large"
                startIcon={<Settings />}
              >
                Manage Employees
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Error Display */}
        {hasError && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              Error loading dashboard statistics. Please try refreshing the page.
            </Alert>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2, mt: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  href="/employees/create" 
                  fullWidth 
                  size="large"
                  startIcon={<Add />}
                  sx={{ py: 2 }}
                >
                  Add Employee
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  href="/companies" 
                  fullWidth 
                  size="large"
                  startIcon={<Business />}
                  sx={{ py: 2 }}
                >
                  Manage Companies
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  href="/departments" 
                  fullWidth 
                  size="large"
                  startIcon={<BusinessCenter />}
                  sx={{ py: 2 }}
                >
                  Manage Departments
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
