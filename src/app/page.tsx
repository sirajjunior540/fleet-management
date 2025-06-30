'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { DirectionsCar, People, Route, TrendingUp, Build } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Fleet Management Platform
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 4, opacity: 0.9 }}>
            Efficiently manage your vehicles, drivers, and routes in one place
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            color="secondary"
            onClick={handleDashboardClick}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            Go to Dashboard
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to manage your fleet efficiently
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <DirectionsCar sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Vehicle Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track vehicle status, maintenance history, and performance metrics in real-time.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <People sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Driver Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage driver profiles, schedules, performance, and compliance documentation.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Route sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Route Optimization
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Plan and optimize delivery routes to reduce fuel consumption and improve efficiency.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Analytics & Reporting
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gain insights into fleet performance with comprehensive analytics and customizable reports.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Build sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Maintenance Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Schedule and track vehicle maintenance to prevent breakdowns and extend vehicle lifespan.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to optimize your fleet operations?
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Get started with our comprehensive fleet management platform today.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="primary"
            onClick={handleDashboardClick}
          >
            Go to Dashboard
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Fleet Management Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
