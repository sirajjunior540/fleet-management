'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  DirectionsCar,
  People,
  Route,
  TrendingUp,
  Build,
  Speed,
  LocalShipping,
  Warning,
  CheckCircle,
  Add,
  Refresh,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { dashboardAPI } from '@/lib/dashboardApi';
import { FleetOverview } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fleetOverview, setFleetOverview] = useState<FleetOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would use the API to get the data
        // const overview = await dashboardAPI.getFleetOverview();
        
        // For now, use mock data
        const overview = await dashboardAPI.getMockFleetOverview();
        setFleetOverview(overview);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fleet overview:', err);
        setError('Failed to load fleet overview data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      dashboardAPI.getMockFleetOverview()
        .then(overview => {
          setFleetOverview(overview);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error refreshing data:', err);
          setError('Failed to refresh data. Please try again later.');
          setLoading(false);
        });
    }, 1000);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleRefresh}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Fleet Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Overview of your fleet operations and performance
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/dashboard/vehicles/new')}
            >
              Add Vehicle
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Fleet Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <DirectionsCar />
                    <Typography variant="h4">{fleetOverview?.total_vehicles || 0}</Typography>
                  </Stack>
                  <Typography variant="body2">Total Vehicles</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${fleetOverview?.active_vehicles || 0} Active`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 1 }} 
                    />
                    <Chip 
                      label={`${fleetOverview?.maintenance_vehicles || 0} In Maintenance`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card sx={{ height: '100%', bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <People />
                    <Typography variant="h4">{fleetOverview?.total_drivers || 0}</Typography>
                  </Stack>
                  <Typography variant="body2">Total Drivers</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${fleetOverview?.on_duty_drivers || 0} On Duty`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 1 }} 
                    />
                    <Chip 
                      label={`${fleetOverview?.off_duty_drivers || 0} Off Duty`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card sx={{ height: '100%', bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <LocalShipping />
                    <Typography variant="h4">{fleetOverview?.deliveries_today || 0}</Typography>
                  </Stack>
                  <Typography variant="body2">Deliveries Today</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${fleetOverview?.deliveries_week || 0} This Week`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card sx={{ height: '100%', bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Build />
                    <Typography variant="h4">{fleetOverview?.maintenance_vehicles || 0}</Typography>
                  </Stack>
                  <Typography variant="body2">Maintenance Due</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      sx={{ 
                        bgcolor: 'rgba(0,0,0,0.2)', 
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.3)',
                        }
                      }}
                      onClick={() => router.push('/dashboard/maintenance')}
                    >
                      View Details
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    startIcon={<DirectionsCar />}
                    fullWidth
                    onClick={() => router.push('/dashboard/vehicles')}
                  >
                    Manage Vehicles
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    startIcon={<People />}
                    fullWidth
                    onClick={() => router.push('/dashboard/drivers')}
                  >
                    Manage Drivers
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Route />}
                    fullWidth
                    onClick={() => router.push('/dashboard/routes')}
                  >
                    Plan Routes
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Build />}
                    fullWidth
                    onClick={() => router.push('/dashboard/maintenance')}
                  >
                    Maintenance
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Maintenance Alert Banner */}
      {(fleetOverview?.maintenance_vehicles || 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Alert
            severity="warning"
            sx={{ mt: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => router.push('/dashboard/maintenance')}
              >
                View Details
              </Button>
            }
          >
            <Typography variant="subtitle2">
              {fleetOverview?.maintenance_vehicles || 0} vehicles require maintenance. Schedule
              service to avoid disruptions.
            </Typography>
          </Alert>
        </motion.div>
      )}
    </Container>
  );
}