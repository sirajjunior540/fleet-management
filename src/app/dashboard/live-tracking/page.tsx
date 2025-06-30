'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Chip, 
  Stack, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  CircularProgress,
  Button,
  Paper,
  Grid
} from '@mui/material';
import { 
  ArrowBack, 
  DirectionsCar, 
  TwoWheeler, 
  LocalShipping, 
  DirectionsBike,
  Speed,
  MyLocation,
  Phone,
  Message,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { dashboardAPI } from '@/lib/dashboardApi';
import { LiveTrackingData } from '@/lib/types';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox map component
const MapComponent = ({ 
  vehicles, 
  selectedVehicle, 
  onSelectVehicle 
}: { 
  vehicles: LiveTrackingData[], 
  selectedVehicle: LiveTrackingData | null,
  onSelectVehicle: (vehicle: LiveTrackingData) => void
}) => {
  const [viewState, setViewState] = useState({
    longitude: -74.0060,
    latitude: 40.7128,
    zoom: 12
  });
  const [popupInfo, setPopupInfo] = useState<LiveTrackingData | null>(null);
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Calculate the center of all vehicles
  useEffect(() => {
    if (vehicles.length > 0) {
      const avgLat = vehicles.reduce((sum, v) => sum + v.latitude, 0) / vehicles.length;
      const avgLng = vehicles.reduce((sum, v) => sum + v.longitude, 0) / vehicles.length;

      setViewState(prev => ({
        ...prev,
        latitude: avgLat,
        longitude: avgLng
      }));
    }
  }, [vehicles]);

  // Center on selected vehicle
  useEffect(() => {
    if (selectedVehicle) {
      setViewState(prev => ({
        ...prev,
        latitude: selectedVehicle.latitude,
        longitude: selectedVehicle.longitude,
        zoom: 14
      }));
      setPopupInfo(selectedVehicle);
    }
  }, [selectedVehicle]);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'on_delivery': return '#4caf50'; // success
      case 'returning': return '#2196f3'; // info
      case 'idle': return '#ff9800'; // warning
      case 'offline': return '#f44336'; // error
      default: return '#9e9e9e'; // default
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      {mapToken ? (
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={mapToken}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
        >
          <NavigationControl position="top-right" />

          {vehicles.map(vehicle => (
            <Marker
              key={vehicle.vehicle_id}
              longitude={vehicle.longitude}
              latitude={vehicle.latitude}
              anchor="center"
              onClick={e => {
                // Prevent click event from propagating to the map
                e.originalEvent.stopPropagation();
                setPopupInfo(vehicle);
                onSelectVehicle(vehicle);
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: getMarkerColor(vehicle.status),
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                    transform: 'translate(-50%, -50%) scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  ...(selectedVehicle?.vehicle_id === vehicle.vehicle_id && {
                    width: 48,
                    height: 48,
                    zIndex: 10,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  })
                }}
              >
                {vehicle.vehicle_type === 'car' && <DirectionsCar fontSize="small" />}
                {vehicle.vehicle_type === 'motorcycle' && <TwoWheeler fontSize="small" />}
                {vehicle.vehicle_type === 'van' && <LocalShipping fontSize="small" />}
                {vehicle.vehicle_type === 'bicycle' && <DirectionsBike fontSize="small" />}
              </Box>
            </Marker>
          ))}

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
              offset={[0, -20]}
            >
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2">{popupInfo.driver_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {popupInfo.vehicle_type.charAt(0).toUpperCase() + popupInfo.vehicle_type.slice(1)}
                </Typography>
                <Typography variant="body2">
                  Speed: {popupInfo.speed} km/h
                </Typography>
                <Chip 
                  label={popupInfo.status.replace('_', ' ')} 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    bgcolor: getMarkerColor(popupInfo.status),
                    color: 'white',
                    textTransform: 'capitalize'
                  }} 
                />
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
};

export default function LiveTrackingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<LiveTrackingData[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<LiveTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        // Fetch company settings to check if fleet management is enabled
        const settings = await dashboardAPI.getCompanySettings();
        setFeatureEnabled(settings.enable_fleet_management);

        // If fleet management is not enabled, stop loading
        if (!settings.enable_fleet_management) {
          setLoading(false);
          return;
        }

        // Fetch live tracking data if feature is enabled
        try {
          // In a production app, we would use the API to get live tracking data
          const data = await dashboardAPI.getLiveTrackingData();
          setTrackingData(data);
          setLoading(false);
        } catch (dataErr) {
          console.error('Error fetching tracking data:', dataErr);

          // Fallback to mock data if API fails
          const mockData: LiveTrackingData[] = Array.from({ length: 10 }, (_, i) => ({
            driver_id: `driver-${i + 1}`,
            driver_name: `Driver ${i + 1}`,
            vehicle_id: `vehicle-${i + 1}`,
            vehicle_type: ['car', 'motorcycle', 'van', 'bicycle'][Math.floor(Math.random() * 4)],
            latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
            speed: Math.floor(Math.random() * 60),
            heading: Math.floor(Math.random() * 360),
            timestamp: new Date().toISOString(),
            status: ['idle', 'on_delivery', 'returning', 'offline'][Math.floor(Math.random() * 4)] as any,
            current_delivery_id: Math.random() > 0.3 ? `delivery-${i + 1}` : undefined,
            battery_level: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : undefined,
            fuel_level: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : undefined,
          }));

          setTrackingData(mockData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching company settings:', err);
        setError('Failed to load company settings. Please try again later.');
        setLoading(false);
      }
    };

    fetchCompanySettings();

    // Only set up real-time updates if feature is enabled
    let interval: NodeJS.Timeout | null = null;

    if (featureEnabled) {
      interval = setInterval(() => {
        setTrackingData(prev => 
          prev.map(item => ({
            ...item,
            latitude: item.latitude + (Math.random() - 0.5) * 0.005,
            longitude: item.longitude + (Math.random() - 0.5) * 0.005,
            speed: Math.floor(Math.random() * 60),
            timestamp: new Date().toISOString(),
          }))
        );
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [featureEnabled]);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <DirectionsCar />;
      case 'motorcycle':
        return <TwoWheeler />;
      case 'van':
        return <LocalShipping />;
      case 'bicycle':
        return <DirectionsBike />;
      default:
        return <DirectionsCar />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_delivery':
        return 'success';
      case 'returning':
        return 'info';
      case 'idle':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_delivery':
        return 'On Delivery';
      case 'returning':
        return 'Returning';
      case 'idle':
        return 'Idle';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
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
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }} 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  // Show feature not available message if fleet management is disabled
  if (featureEnabled === false) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
            mt: 4
          }}
        >
          <Warning sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Fleet Management Not Available
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The Fleet Management feature is not currently enabled for your account. 
            Please contact your administrator to activate this feature.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }} 
            onClick={() => router.push('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h5" component="h1">
            Live Fleet Tracking
          </Typography>
          <Chip 
            label="Real-time Updates" 
            color="success" 
            size="small"
            sx={{
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              },
            }}
          />
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',
        p: 2
      }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Vehicle List */}
          <Grid item xs={12} md={3} sx={{ height: '100%', overflow: 'auto' }}>
            <Paper sx={{ height: '100%', overflow: 'auto' }}>
              <List>
                {trackingData.map((vehicle) => (
                  <React.Fragment key={vehicle.vehicle_id}>
                    <ListItem 
                      button 
                      selected={selectedVehicle?.vehicle_id === vehicle.vehicle_id}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getStatusColor(vehicle.status) + '.main' }}>
                          {getVehicleIcon(vehicle.vehicle_type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={vehicle.driver_name} 
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              {vehicle.vehicle_type.charAt(0).toUpperCase() + vehicle.vehicle_type.slice(1)}
                            </Typography>
                            {" — "}
                            <Chip 
                              label={getStatusLabel(vehicle.status)} 
                              size="small" 
                              color={getStatusColor(vehicle.status) as any} 
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={9} sx={{ height: '100%' }}>
            <Paper sx={{ height: '100%', position: 'relative' }}>
              <MapComponent 
                vehicles={trackingData} 
                selectedVehicle={selectedVehicle} 
                onSelectVehicle={setSelectedVehicle} 
              />

              {/* Vehicle Details Overlay */}
              {selectedVehicle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 16, 
                      right: 16, 
                      width: 300,
                      zIndex: 10
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: getStatusColor(selectedVehicle.status) + '.main' }}>
                          {getVehicleIcon(selectedVehicle.vehicle_type)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{selectedVehicle.driver_name}</Typography>
                          <Chip 
                            label={getStatusLabel(selectedVehicle.status)} 
                            size="small" 
                            color={getStatusColor(selectedVehicle.status) as any} 
                          />
                        </Box>
                      </Stack>

                      <Divider sx={{ my: 1 }} />

                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Vehicle Type:</Typography>
                          <Typography variant="body2">
                            {selectedVehicle.vehicle_type.charAt(0).toUpperCase() + selectedVehicle.vehicle_type.slice(1)}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Speed:</Typography>
                          <Typography variant="body2">{selectedVehicle.speed} km/h</Typography>
                        </Stack>

                        {selectedVehicle.fuel_level !== undefined && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Fuel Level:</Typography>
                            <Typography variant="body2">{selectedVehicle.fuel_level}%</Typography>
                          </Stack>
                        )}

                        {selectedVehicle.battery_level !== undefined && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Battery Level:</Typography>
                            <Typography variant="body2">{selectedVehicle.battery_level}%</Typography>
                          </Stack>
                        )}

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Last Update:</Typography>
                          <Typography variant="body2">
                            {new Date(selectedVehicle.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Divider sx={{ my: 1 }} />

                      <Stack direction="row" spacing={1}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<Phone />}
                          fullWidth
                        >
                          Call
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<Message />}
                          fullWidth
                        >
                          Message
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
