'use client';

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Error as ErrorIcon } from '@mui/icons-material';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h3" component="h1" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => router.push('/dashboard')}
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}