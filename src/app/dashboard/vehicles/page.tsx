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
  DirectionsCar,
  Add,
  FilterList,
  TwoWheeler,
  LocalShipping,
  DirectionsBike,
  Build,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import VehicleList from '../components/VehicleList';

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
      id={`vehicle-tabpanel-${index}`}
      aria-labelledby={`vehicle-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vehicle-tab-${index}`,
    'aria-controls': `vehicle-tabpanel-${index}`,
  };
}

export default function VehiclesPage() {
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
              Vehicle Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your fleet vehicles, track maintenance, and assign drivers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/dashboard/vehicles/new')}
          >
            Add Vehicle
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="vehicle management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="All Vehicles"
            icon={<DirectionsCar />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Cars"
            icon={<DirectionsCar />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="Motorcycles"
            icon={<TwoWheeler />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label="Vans"
            icon={<LocalShipping />}
            iconPosition="start"
            {...a11yProps(3)}
          />
          <Tab
            label="Bicycles"
            icon={<DirectionsBike />}
            iconPosition="start"
            {...a11yProps(4)}
          />
          <Tab
            label="Maintenance Due"
            icon={<Build />}
            iconPosition="start"
            {...a11yProps(5)}
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <VehicleList />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {/* In a real app, we would filter vehicles by type */}
        <VehicleList />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <VehicleList />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <VehicleList />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <VehicleList />
      </TabPanel>
      <TabPanel value={activeTab} index={5}>
        <VehicleList />
      </TabPanel>
    </Container>
  );
}