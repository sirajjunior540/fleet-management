'use client';

import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp as AnalyticsIcon,
  DateRange as DateRangeIcon,
  LocalGasStation as FuelIcon,
  Speed as SpeedIcon,
  DirectionsCar as VehicleIcon,
  People as DriverIcon,
  Route as RouteIcon,
  Build as MaintenanceIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Mock data for charts
const generateMockData = () => {
  // Vehicle usage data (miles per month)
  const vehicleUsageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Miles',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5000) + 2000),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
        fill: true,
      }
    ]
  };

  // Fuel consumption data
  const fuelConsumptionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Fuel Consumption (gallons)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 500) + 200),
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderWidth: 2,
        fill: true,
      }
    ]
  };

  // Maintenance costs data
  const maintenanceCostsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Maintenance Costs ($)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 3000) + 500),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        fill: true,
      }
    ]
  };

  // Vehicle efficiency data (miles per gallon)
  const vehicleEfficiencyData = {
    labels: ['Car 1', 'Car 2', 'Car 3', 'Van 1', 'Van 2', 'Truck 1', 'Motorcycle 1'],
    datasets: [
      {
        label: 'Miles per Gallon',
        data: [28, 32, 25, 18, 16, 12, 45],
        backgroundColor: [
          'rgba(25, 118, 210, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(244, 67, 54, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(156, 39, 176, 0.7)',
          'rgba(0, 188, 212, 0.7)',
          'rgba(255, 87, 34, 0.7)',
        ],
        borderWidth: 1,
      }
    ]
  };

  // Driver performance data
  const driverPerformanceData = {
    labels: ['Driver 1', 'Driver 2', 'Driver 3', 'Driver 4', 'Driver 5'],
    datasets: [
      {
        label: 'Performance Score',
        data: [85, 92, 78, 88, 95],
        backgroundColor: 'rgba(25, 118, 210, 0.7)',
        borderColor: '#1976d2',
        borderWidth: 1,
      },
      {
        label: 'Safety Score',
        data: [90, 85, 82, 95, 88],
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: '#4caf50',
        borderWidth: 1,
      }
    ]
  };

  return {
    vehicleUsageData,
    fuelConsumptionData,
    maintenanceCostsData,
    vehicleEfficiencyData,
    driverPerformanceData
  };
};

// Key metrics data
const keyMetrics = [
  { title: 'Total Miles', value: '245,890', change: '+12%', icon: <RouteIcon sx={{ fontSize: 40, color: 'primary.main' }} /> },
  { title: 'Fuel Consumption', value: '12,450 gal', change: '-5%', icon: <FuelIcon sx={{ fontSize: 40, color: 'error.main' }} /> },
  { title: 'Maintenance Costs', value: '$34,250', change: '+2%', icon: <MaintenanceIcon sx={{ fontSize: 40, color: 'warning.main' }} /> },
  { title: 'Average MPG', value: '24.5', change: '+8%', icon: <SpeedIcon sx={{ fontSize: 40, color: 'success.main' }} /> },
];

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  };
}

// Chart component placeholder
function ChartPlaceholder({ title, height = 300 }: { title: string, height?: number }) {
  return (
    <Box 
      sx={{ 
        height, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 2,
        border: '1px dashed',
        borderColor: 'divider'
      }}
    >
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        (Chart visualization would appear here in a real implementation)
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Note: In a real implementation, this would use a charting library like Chart.js, Recharts, or Nivo
      </Typography>
    </Box>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('last30days');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setChartData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setChartData(generateMockData());
      setLoading(false);
    }, 1000);
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
              Analytics & Reporting
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gain insights into your fleet performance and operations
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => alert('Download report functionality would be implemented here')}
            >
              Export Report
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshData}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Time Range Selector */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <DateRangeIcon color="primary" />
          <Typography variant="body1">Time Period:</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange as any}
              displayEmpty
              size="small"
            >
              <MenuItem value="last7days">Last 7 Days</MenuItem>
              <MenuItem value="last30days">Last 30 Days</MenuItem>
              <MenuItem value="last90days">Last 90 Days</MenuItem>
              <MenuItem value="lastYear">Last Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Key Metrics */}
      <Typography variant="h6" gutterBottom>
        Key Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {keyMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1 }}>
                      {metric.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={metric.change.startsWith('+') ? 'success.main' : 'error.main'}
                    >
                      {metric.change} from previous period
                    </Typography>
                  </Box>
                  {metric.icon}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="analytics tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Overview"
            icon={<AnalyticsIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Vehicle Performance"
            icon={<VehicleIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="Driver Performance"
            icon={<DriverIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label="Maintenance Analysis"
            icon={<MaintenanceIcon />}
            iconPosition="start"
            {...a11yProps(3)}
          />
        </Tabs>
      </Paper>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tab Panels */}
      {!loading && (
        <>
          {/* Overview Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader title="Fleet Usage Over Time" />
                  <CardContent>
                    <ChartPlaceholder title="Line Chart: Total Miles Driven Over Time" height={350} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Vehicle Type Distribution" />
                  <CardContent>
                    <ChartPlaceholder title="Pie Chart: Vehicle Types" height={350} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Fuel Consumption Trends" />
                  <CardContent>
                    <ChartPlaceholder title="Bar Chart: Monthly Fuel Consumption" height={300} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Maintenance Costs" />
                  <CardContent>
                    <ChartPlaceholder title="Bar Chart: Monthly Maintenance Costs" height={300} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Vehicle Performance Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Vehicle Efficiency Comparison" />
                  <CardContent>
                    <ChartPlaceholder title="Bar Chart: Miles per Gallon by Vehicle" height={350} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Vehicle Utilization" />
                  <CardContent>
                    <ChartPlaceholder title="Horizontal Bar Chart: Hours Used per Vehicle" height={400} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Mileage Comparison" />
                  <CardContent>
                    <ChartPlaceholder title="Radar Chart: Vehicle Performance Metrics" height={400} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Driver Performance Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Driver Performance Scores" />
                  <CardContent>
                    <ChartPlaceholder title="Bar Chart: Driver Performance and Safety Scores" height={350} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Driver Efficiency" />
                  <CardContent>
                    <ChartPlaceholder title="Line Chart: Miles per Hour by Driver" height={300} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Safety Incidents" />
                  <CardContent>
                    <ChartPlaceholder title="Scatter Plot: Safety Incidents by Driver" height={300} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Maintenance Analysis Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Maintenance Costs by Vehicle Type" />
                  <CardContent>
                    <ChartPlaceholder title="Stacked Bar Chart: Maintenance Costs by Vehicle Type" height={350} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Maintenance Frequency" />
                  <CardContent>
                    <ChartPlaceholder title="Heat Map: Maintenance Frequency by Vehicle" height={300} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Parts Replacement Analysis" />
                  <CardContent>
                    <ChartPlaceholder title="Pie Chart: Most Frequently Replaced Parts" height={300} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}
    </Container>
  );
}