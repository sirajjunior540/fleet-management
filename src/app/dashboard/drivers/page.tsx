'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  Add,
  CheckCircle,
  LocalShipping,
  AccessTime,
  DoNotDisturb,
  TrendingUp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DriverList from '../components/DriverList';

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
      id={`driver-tabpanel-${index}`}
      aria-labelledby={`driver-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `driver-tab-${index}`,
    'aria-controls': `driver-tabpanel-${index}`,
  };
}

export default function DriversPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
              Driver Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your drivers, track performance, and assign routes
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/dashboard/drivers/new')}
          >
            Add Driver
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="driver management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="All Drivers"
            icon={<People />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Available"
            icon={<CheckCircle />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="On Delivery"
            icon={<LocalShipping />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label="On Break"
            icon={<AccessTime />}
            iconPosition="start"
            {...a11yProps(3)}
          />
          <Tab
            label="Offline"
            icon={<DoNotDisturb />}
            iconPosition="start"
            {...a11yProps(4)}
          />
          <Tab
            label="Performance"
            icon={<TrendingUp />}
            iconPosition="start"
            {...a11yProps(5)}
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <DriverList />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {/* In a real app, we would filter drivers by status */}
        <DriverList />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <DriverList />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <DriverList />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <DriverList />
      </TabPanel>
      <TabPanel value={activeTab} index={5}>
        <DriverList />
      </TabPanel>
    </Container>
  );
}