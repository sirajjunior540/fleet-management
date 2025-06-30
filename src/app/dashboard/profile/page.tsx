'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { authUtils } from '@/lib/auth';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

// Mock user data
const mockUser = {
  id: 'USR-1001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  role: 'Fleet Manager',
  department: 'Operations',
  joinDate: '2022-03-15',
  avatarUrl: '',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA',
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    twoFactorAuth: false,
  }
};

// Mock activity history
const mockActivityHistory = [
  { id: 1, action: 'Logged in', timestamp: '2023-06-30T09:45:00Z' },
  { id: 2, action: 'Updated vehicle VEH-1002 maintenance record', timestamp: '2023-06-29T14:22:00Z' },
  { id: 3, action: 'Created new route RT-1005', timestamp: '2023-06-28T11:15:00Z' },
  { id: 4, action: 'Added driver DRV-1008', timestamp: '2023-06-27T16:30:00Z' },
  { id: 5, action: 'Generated monthly analytics report', timestamp: '2023-06-26T10:05:00Z' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
  });

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setUser(mockUser);
      setActivityHistory(mockActivityHistory);
      setFormData({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        phone: mockUser.phone,
        department: mockUser.department,
        street: mockUser.address.street,
        city: mockUser.address.city,
        state: mockUser.address.state,
        zipCode: mockUser.address.zipCode,
        country: mockUser.address.country,
      });
      setNotificationPreferences({
        emailNotifications: mockUser.preferences.emailNotifications,
        pushNotifications: mockUser.preferences.pushNotifications,
        weeklyReports: mockUser.preferences.weeklyReports,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset form data if canceling edit
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        department: user.department,
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
        country: user.address.country,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPreferences({
      ...notificationPreferences,
      [name]: checked,
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would save profile data to the backend
    setUser({
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
    });
    setEditMode(false);
    setSnackbarMessage('Profile updated successfully');
    setSnackbarOpen(true);
  };

  const handleSavePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbarMessage('New passwords do not match');
      setSnackbarOpen(true);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSnackbarMessage('Password must be at least 8 characters long');
      setSnackbarOpen(true);
      return;
    }
    
    // In a real app, this would save the new password to the backend
    setSnackbarMessage('Password updated successfully');
    setSnackbarOpen(true);
    
    // Reset password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSaveNotifications = () => {
    // In a real app, this would save notification preferences to the backend
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        ...notificationPreferences,
      },
    });
    setSnackbarMessage('Notification preferences updated successfully');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your account information
        </Typography>
      </Box>

      {/* Profile Overview Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto',
                  bgcolor: 'primary.main',
                  fontSize: 48
                }}
                src={user.avatarUrl}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </Avatar>
              <Box sx={{ position: 'relative', mt: -3, ml: 8 }}>
                <IconButton 
                  color="primary" 
                  aria-label="upload picture" 
                  component="label"
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.default' }
                  }}
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={10}>
              <Typography variant="h5" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {user.role} • {user.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant={editMode ? "outlined" : "contained"} 
                  startIcon={editMode ? null : <EditIcon />}
                  onClick={handleEditToggle}
                  sx={{ mr: 2 }}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
                {editMode && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="profile tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Personal Information"
            icon={<PersonIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Security"
            icon={<LockIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="Notifications"
            icon={<NotificationsIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label="Activity History"
            icon={<HistoryIcon />}
            iconPosition="start"
            {...a11yProps(3)}
          />
        </Tabs>
      </Paper>

      {/* Personal Information Tab */}
      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardHeader title="Personal Information" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Address
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ZIP/Postal Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardHeader 
            title="Change Password" 
            avatar={<SecurityIcon color="primary" />}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  helperText="Password must be at least 8 characters long"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                  helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? "Passwords don't match" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSavePassword}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mt: 4 }}>
          <CardHeader 
            title="Two-Factor Authentication" 
            avatar={<LockIcon color="primary" />}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  {user.preferences.twoFactorAuth ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardHeader title="Notification Preferences" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Email Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Receive email notifications for important updates and alerts
                </Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Button
                    variant={notificationPreferences.emailNotifications ? "contained" : "outlined"}
                    color={notificationPreferences.emailNotifications ? "primary" : "inherit"}
                    onClick={() => setNotificationPreferences({
                      ...notificationPreferences,
                      emailNotifications: !notificationPreferences.emailNotifications
                    })}
                    sx={{ mr: 2 }}
                  >
                    {notificationPreferences.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Push Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Receive push notifications in your browser
                </Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Button
                    variant={notificationPreferences.pushNotifications ? "contained" : "outlined"}
                    color={notificationPreferences.pushNotifications ? "primary" : "inherit"}
                    onClick={() => setNotificationPreferences({
                      ...notificationPreferences,
                      pushNotifications: !notificationPreferences.pushNotifications
                    })}
                    sx={{ mr: 2 }}
                  >
                    {notificationPreferences.pushNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Weekly Reports
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Receive weekly summary reports of fleet activity
                </Typography>
                <Box sx={{ mt: 1, mb: 3 }}>
                  <Button
                    variant={notificationPreferences.weeklyReports ? "contained" : "outlined"}
                    color={notificationPreferences.weeklyReports ? "primary" : "inherit"}
                    onClick={() => setNotificationPreferences({
                      ...notificationPreferences,
                      weeklyReports: !notificationPreferences.weeklyReports
                    })}
                    sx={{ mr: 2 }}
                  >
                    {notificationPreferences.weeklyReports ? 'Enabled' : 'Disabled'}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveNotifications}
                >
                  Save Preferences
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Activity History Tab */}
      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardHeader title="Recent Activity" />
          <Divider />
          <CardContent>
            <List>
              {activityHistory.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={formatDate(activity.timestamp)}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
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

// List component for activity history
function List({ children }: { children: React.ReactNode }) {
  return (
    <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
      {children}
    </Box>
  );
}

// ListItem component for activity history
function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <Box component="li" sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
      {children}
    </Box>
  );
}

// ListItemIcon component for activity history
function ListItemIcon({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ mr: 2, color: 'text.secondary' }}>
      {children}
    </Box>
  );
}

// ListItemText component for activity history
function ListItemText({ primary, secondary }: { primary: string, secondary: string }) {
  return (
    <Box>
      <Typography variant="body1">{primary}</Typography>
      <Typography variant="body2" color="text.secondary">{secondary}</Typography>
    </Box>
  );
}