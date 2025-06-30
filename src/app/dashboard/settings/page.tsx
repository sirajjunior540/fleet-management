'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // General settings state
  const [companyName, setCompanyName] = useState('Fleet Management Inc.');
  const [email, setEmail] = useState('admin@fleetmanagement.com');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [distanceUnit, setDistanceUnit] = useState('miles');
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [driverReports, setDriverReports] = useState(true);
  const [fuelAlerts, setFuelAlerts] = useState(true);
  
  // Security settings state
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  
  // Appearance settings state
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1976d2');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings to the backend
    setSnackbarMessage('Settings saved successfully');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your fleet management platform settings
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="settings tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="General"
            icon={<SettingsIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Notifications"
            icon={<NotificationsIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="Security"
            icon={<SecurityIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label="Appearance"
            icon={<PaletteIcon />}
            iconPosition="start"
            {...a11yProps(3)}
          />
        </Tabs>
      </Paper>

      {/* General Settings */}
      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Admin Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Regional Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={timezone}
                    label="Timezone"
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">Eastern Time (EST)</MenuItem>
                    <MenuItem value="CST">Central Time (CST)</MenuItem>
                    <MenuItem value="MST">Mountain Time (MST)</MenuItem>
                    <MenuItem value="PST">Pacific Time (PST)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={dateFormat}
                    label="Date Format"
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Distance Unit</InputLabel>
                  <Select
                    value={distanceUnit}
                    label="Distance Unit"
                    onChange={(e) => setDistanceUnit(e.target.value)}
                  >
                    <MenuItem value="miles">Miles</MenuItem>
                    <MenuItem value="kilometers">Kilometers</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Notification Settings */}
      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive notifications via email
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                    />
                  }
                  label="Push Notifications"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive notifications in the browser
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Alert Types
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={maintenanceAlerts}
                      onChange={(e) => setMaintenanceAlerts(e.target.checked)}
                    />
                  }
                  label="Maintenance Alerts"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={driverReports}
                      onChange={(e) => setDriverReports(e.target.checked)}
                    />
                  }
                  label="Driver Reports"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={fuelAlerts}
                      onChange={(e) => setFuelAlerts(e.target.checked)}
                    />
                  }
                  label="Fuel Level Alerts"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Settings */}
      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Authentication
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    />
                  }
                  label="Two-Factor Authentication"
                />
                <Typography variant="body2" color="text.secondary">
                  Require a verification code in addition to password
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Password Policy
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password Expiry (days)"
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Alert severity="info">
                For enhanced security, we recommend enabling two-factor authentication and setting a reasonable password expiry period.
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Appearance Settings */}
      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Theme
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                  }
                  label="Dark Mode"
                />
                <Typography variant="body2" color="text.secondary">
                  Use dark theme throughout the application
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={compactView}
                      onChange={(e) => setCompactView(e.target.checked)}
                    />
                  }
                  label="Compact View"
                />
                <Typography variant="body2" color="text.secondary">
                  Reduce spacing to show more content
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Colors
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: primaryColor,
                          mr: 1,
                        }}
                      />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}