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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Route as RouteIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  DirectionsCar as VehicleIcon,
  Person as DriverIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  LocalShipping as DeliveryIcon,
  Flag as FlagIcon,
  MyLocation as CurrentLocationIcon,
  Timeline as OptimizeIcon,
} from '@mui/icons-material';
import Map, { Marker, Popup, NavigationControl, Source, Layer, LineLayer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock data for routes
const mockRoutes = [
  {
    id: 'RT-1001',
    name: 'Downtown Delivery Route',
    status: 'active',
    distance: 12.5,
    estimatedTime: 45,
    stops: 8,
    assignedVehicle: 'VEH-1001',
    assignedDriver: 'DRV-1002',
    startLocation: '123 Main St, City Center',
    endLocation: '123 Main St, City Center',
    optimized: true,
  },
  {
    id: 'RT-1002',
    name: 'North Suburb Route',
    status: 'active',
    distance: 18.3,
    estimatedTime: 60,
    stops: 12,
    assignedVehicle: 'VEH-1003',
    assignedDriver: 'DRV-1005',
    startLocation: '456 Warehouse Ave, Industrial District',
    endLocation: '456 Warehouse Ave, Industrial District',
    optimized: true,
  },
  {
    id: 'RT-1003',
    name: 'East Side Express',
    status: 'planned',
    distance: 15.7,
    estimatedTime: 50,
    stops: 10,
    assignedVehicle: 'VEH-1002',
    assignedDriver: 'DRV-1001',
    startLocation: '789 Distribution Center, Logistics Park',
    endLocation: '789 Distribution Center, Logistics Park',
    optimized: false,
  },
  {
    id: 'RT-1004',
    name: 'South Mall Circuit',
    status: 'completed',
    distance: 9.8,
    estimatedTime: 35,
    stops: 6,
    assignedVehicle: 'VEH-1005',
    assignedDriver: 'DRV-1003',
    startLocation: '101 Fleet HQ, Business Park',
    endLocation: '101 Fleet HQ, Business Park',
    optimized: true,
  },
  {
    id: 'RT-1005',
    name: 'West Industrial Zone',
    status: 'active',
    distance: 22.4,
    estimatedTime: 75,
    stops: 15,
    assignedVehicle: 'VEH-1004',
    assignedDriver: 'DRV-1004',
    startLocation: '202 Dispatch Center, Transport Hub',
    endLocation: '202 Dispatch Center, Transport Hub',
    optimized: true,
  },
];

// Mock data for stops on a route
const mockStops = [
  { id: 'STP-1', address: '123 Main St, Apt 4B', timeWindow: '9:00 AM - 11:00 AM', status: 'completed' },
  { id: 'STP-2', address: '456 Oak Ave', timeWindow: '10:00 AM - 12:00 PM', status: 'completed' },
  { id: 'STP-3', address: '789 Pine St, Suite 101', timeWindow: '11:00 AM - 1:00 PM', status: 'in-progress' },
  { id: 'STP-4', address: '321 Maple Rd', timeWindow: '12:00 PM - 2:00 PM', status: 'pending' },
  { id: 'STP-5', address: '654 Elm Blvd', timeWindow: '1:00 PM - 3:00 PM', status: 'pending' },
  { id: 'STP-6', address: '987 Cedar Ln', timeWindow: '2:00 PM - 4:00 PM', status: 'pending' },
  { id: 'STP-7', address: '246 Birch Dr', timeWindow: '3:00 PM - 5:00 PM', status: 'pending' },
  { id: 'STP-8', address: '135 Walnut Ct', timeWindow: '4:00 PM - 6:00 PM', status: 'pending' },
];

// Mock data for available vehicles
const mockVehicles = [
  { id: 'VEH-1001', name: 'Delivery Van 1', type: 'van' },
  { id: 'VEH-1002', name: 'Delivery Van 2', type: 'van' },
  { id: 'VEH-1003', name: 'Cargo Truck 1', type: 'truck' },
  { id: 'VEH-1004', name: 'Cargo Truck 2', type: 'truck' },
  { id: 'VEH-1005', name: 'Compact Car 1', type: 'car' },
];

// Mock data for available drivers
const mockDrivers = [
  { id: 'DRV-1001', name: 'John Smith' },
  { id: 'DRV-1002', name: 'Jane Doe' },
  { id: 'DRV-1003', name: 'Michael Johnson' },
  { id: 'DRV-1004', name: 'Emily Williams' },
  { id: 'DRV-1005', name: 'David Brown' },
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
      id={`routes-tabpanel-${index}`}
      aria-labelledby={`routes-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `routes-tab-${index}`,
    'aria-controls': `routes-tabpanel-${index}`,
  };
}

// Route Map component
function RouteMapComponent({ 
  route, 
  stops = [],
  height = 400 
}: { 
  route: any, 
  stops?: any[],
  height?: number 
}) {
  const [viewState, setViewState] = useState({
    longitude: -74.0060,
    latitude: 40.7128,
    zoom: 11
  });
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // For a real implementation, we would geocode the addresses to get coordinates
  // Here we're generating mock coordinates based on the route name
  const generateMockCoordinates = () => {
    // Base coordinates (New York City)
    const baseLat = 40.7128;
    const baseLng = -74.0060;

    // Generate a seed from the route name for consistent randomness
    const seed = route.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (n: number) => {
      const x = Math.sin(n + seed) * 10000;
      return x - Math.floor(x);
    };

    // Generate start and end coordinates
    const startCoords = [baseLng + (random(1) - 0.5) * 0.05, baseLat + (random(2) - 0.5) * 0.05];
    const endCoords = [baseLng + (random(3) - 0.5) * 0.05, baseLat + (random(4) - 0.5) * 0.05];

    // Generate waypoints (stop coordinates)
    const waypoints = stops.map((_, i) => [
      baseLng + (random(i * 2 + 5) - 0.5) * 0.05,
      baseLat + (random(i * 2 + 6) - 0.5) * 0.05
    ]);

    return {
      start: startCoords,
      end: endCoords,
      waypoints
    };
  };

  // Generate route coordinates
  const routeCoordinates = React.useMemo(() => {
    return generateMockCoordinates();
  }, [route.id, stops.length]);

  // Create GeoJSON for the route line
  const routeGeoJSON = React.useMemo(() => {
    const allPoints = [
      routeCoordinates.start,
      ...routeCoordinates.waypoints,
      routeCoordinates.end
    ];

    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: allPoints
      }
    };
  }, [routeCoordinates]);

  // Set the map view to fit the route
  useEffect(() => {
    if (routeCoordinates) {
      // Calculate the center of all points
      const lngs = [routeCoordinates.start[0], ...routeCoordinates.waypoints.map(wp => wp[0]), routeCoordinates.end[0]];
      const lats = [routeCoordinates.start[1], ...routeCoordinates.waypoints.map(wp => wp[1]), routeCoordinates.end[1]];

      const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
      const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;

      setViewState({
        longitude: avgLng,
        latitude: avgLat,
        zoom: 11
      });
    }
  }, [routeCoordinates]);

  // Line layer style
  const lineLayer: LineLayer = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': route.optimized ? '#4caf50' : '#2196f3',
      'line-width': 4,
      'line-opacity': 0.8
    }
  };

  return (
    <Box sx={{ height, width: '100%' }}>
      {mapToken ? (
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={mapToken}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
        >
          <NavigationControl position="top-right" />

          {/* Route line */}
          <Source id="route-path" type="geojson" data={routeGeoJSON as any}>
            <Layer {...lineLayer} />
          </Source>

          {/* Start marker */}
          <Marker
            longitude={routeCoordinates.start[0]}
            latitude={routeCoordinates.start[1]}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo({
                longitude: routeCoordinates.start[0],
                latitude: routeCoordinates.start[1],
                title: 'Start Location',
                description: route.startLocation
              });
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'success.main',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <LocationIcon fontSize="small" />
            </Box>
          </Marker>

          {/* End marker */}
          <Marker
            longitude={routeCoordinates.end[0]}
            latitude={routeCoordinates.end[1]}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo({
                longitude: routeCoordinates.end[0],
                latitude: routeCoordinates.end[1],
                title: 'End Location',
                description: route.endLocation
              });
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'error.main',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <FlagIcon fontSize="small" />
            </Box>
          </Marker>

          {/* Stop markers */}
          {routeCoordinates.waypoints.map((waypoint, index) => (
            <Marker
              key={`stop-${index}`}
              longitude={waypoint[0]}
              latitude={waypoint[1]}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({
                  longitude: waypoint[0],
                  latitude: waypoint[1],
                  title: `Stop ${index + 1}`,
                  description: stops[index]?.address || `Waypoint ${index + 1}`
                });
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: 'info.main',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {index + 1}
              </Box>
            </Marker>
          ))}

          {/* Popup for location details */}
          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2">{popupInfo.title}</Typography>
                <Typography variant="body2">{popupInfo.description}</Typography>
              </Box>
            </Popup>
          )}
        </Map>
      ) : (
        <Box 
          sx={{ 
            height: '100%', 
            width: '100%', 
            bgcolor: '#e5e5e5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 2,
            p: 3
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Mapbox API Token Missing
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Please add your Mapbox API token to the .env file as NEXT_PUBLIC_MAPBOX_TOKEN
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function RoutesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setRoutes(mockRoutes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route);
    // Simulate loading stops for the selected route
    setLoading(true);
    setTimeout(() => {
      setStops(mockStops);
      setLoading(false);
    }, 500);
  };

  const handleOptimizeRoute = () => {
    if (!selectedRoute) return;

    setOptimizing(true);
    // Simulate route optimization
    setTimeout(() => {
      setOptimizing(false);
      setSelectedRoute({
        ...selectedRoute,
        optimized: true,
        distance: (selectedRoute.distance * 0.85).toFixed(1),
        estimatedTime: Math.floor(selectedRoute.estimatedTime * 0.85)
      });

      // Update the route in the routes list
      const updatedRoutes = routes.map(route => 
        route.id === selectedRoute.id 
          ? {
              ...route,
              optimized: true,
              distance: (route.distance * 0.85).toFixed(1),
              estimatedTime: Math.floor(route.estimatedTime * 0.85)
            }
          : route
      );
      setRoutes(updatedRoutes);

      // Show success message (in a real app)
      alert('Route optimized successfully! Distance and time reduced by approximately 15%.');
    }, 2000);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRouteName('');
    setSelectedVehicle('');
    setSelectedDriver('');
  };

  const handleCreateRoute = () => {
    if (!newRouteName) return;

    // Create a new route
    const newRoute = {
      id: `RT-${1000 + routes.length + 1}`,
      name: newRouteName,
      status: 'planned',
      distance: 0,
      estimatedTime: 0,
      stops: 0,
      assignedVehicle: selectedVehicle || undefined,
      assignedDriver: selectedDriver || undefined,
      startLocation: '101 Fleet HQ, Business Park',
      endLocation: '101 Fleet HQ, Business Park',
      optimized: false,
    };

    setRoutes([...routes, newRoute]);
    handleCloseDialog();

    // Select the new route
    setSelectedRoute(newRoute);
    setStops([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'planned':
        return 'info';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
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
              Route Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Plan, optimize, and track delivery routes
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Create Route
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="routes tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="All Routes"
            icon={<RouteIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Active Routes"
            icon={<DeliveryIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="Planned Routes"
            icon={<ScheduleIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label="Completed Routes"
            icon={<FlagIcon />}
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
          {/* All Routes Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ mb: 2 }}>
                  <CardHeader title="Routes" />
                  <Divider />
                  <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                    {routes.map((route) => (
                      <React.Fragment key={route.id}>
                        <ListItem 
                          button 
                          selected={selectedRoute?.id === route.id}
                          onClick={() => handleRouteSelect(route)}
                        >
                          <ListItemIcon>
                            <RouteIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={route.name} 
                            secondary={`${route.distance} miles • ${route.stops} stops`}
                          />
                          <Chip 
                            label={route.status} 
                            size="small" 
                            color={getStatusColor(route.status) as any}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                {selectedRoute ? (
                  <>
                    <Card sx={{ mb: 4 }}>
                      <CardHeader 
                        title={selectedRoute.name}
                        action={
                          <Stack direction="row" spacing={1}>
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        }
                      />
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Route ID
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedRoute.id}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                              Status
                            </Typography>
                            <Chip 
                              label={selectedRoute.status} 
                              color={getStatusColor(selectedRoute.status) as any}
                              sx={{ mt: 0.5 }}
                            />

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                              Assigned Vehicle
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedRoute.assignedVehicle || 'None'}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                              Assigned Driver
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedRoute.assignedDriver || 'None'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Total Distance
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedRoute.distance} miles
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                              Estimated Time
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedRoute.estimatedTime} minutes
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                              Start Location
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedRoute.startLocation}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                              End Location
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedRoute.endLocation}
                            </Typography>
                          </Grid>
                        </Grid>

                        {!selectedRoute.optimized && (
                          <Box sx={{ mt: 3 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<OptimizeIcon />}
                              onClick={handleOptimizeRoute}
                              disabled={optimizing}
                            >
                              {optimizing ? 'Optimizing...' : 'Optimize Route'}
                            </Button>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              Optimize this route to reduce distance and time
                            </Typography>
                          </Box>
                        )}

                        {selectedRoute.optimized && (
                          <Alert severity="success" sx={{ mt: 3 }}>
                            This route has been optimized for efficiency
                          </Alert>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader title="Route Map" />
                      <CardContent>
                        <RouteMapComponent route={selectedRoute} stops={stops} height={400} />
                      </CardContent>
                    </Card>

                    <Card sx={{ mt: 4 }}>
                      <CardHeader 
                        title="Stops" 
                        action={
                          <Button
                            startIcon={<AddIcon />}
                            size="small"
                          >
                            Add Stop
                          </Button>
                        }
                      />
                      <Divider />
                      {stops.length > 0 ? (
                        <List>
                          {stops.map((stop, index) => (
                            <React.Fragment key={stop.id}>
                              <ListItem>
                                <ListItemIcon>
                                  <Chip label={index + 1} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={stop.address} 
                                  secondary={`Time Window: ${stop.timeWindow}`}
                                />
                                <Chip 
                                  label={stop.status} 
                                  color={
                                    stop.status === 'completed' ? 'success' : 
                                    stop.status === 'in-progress' ? 'warning' : 'default'
                                  }
                                  size="small"
                                />
                                <IconButton size="small" sx={{ ml: 1 }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </ListItem>
                              <Divider component="li" />
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            No stops added to this route yet
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            sx={{ mt: 2 }}
                          >
                            Add First Stop
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: 400,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      p: 3,
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}
                  >
                    <RouteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No Route Selected
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                      Select a route from the list to view details or create a new route
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ mt: 3 }}
                      onClick={handleOpenDialog}
                    >
                      Create Route
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Active Routes Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {routes.filter(route => route.status === 'active').length} active routes found
                </Typography>
                {/* In a real app, this would show only active routes */}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Planned Routes Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {routes.filter(route => route.status === 'planned').length} planned routes found
                </Typography>
                {/* In a real app, this would show only planned routes */}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Completed Routes Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {routes.filter(route => route.status === 'completed').length} completed routes found
                </Typography>
                {/* In a real app, this would show only completed routes */}
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}

      {/* Create Route Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Route</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Route Name"
            fullWidth
            variant="outlined"
            value={newRouteName}
            onChange={(e) => setNewRouteName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Assign Vehicle</InputLabel>
            <Select
              value={selectedVehicle}
              label="Assign Vehicle"
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {mockVehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Assign Driver</InputLabel>
            <Select
              value={selectedDriver}
              label="Assign Driver"
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {mockDrivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateRoute} 
            variant="contained"
            disabled={!newRouteName}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
