'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  LinearProgress,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  DirectionsCar,
  TwoWheeler,
  LocalShipping,
  DirectionsBike,
  Edit,
  Delete,
  Visibility,
  Build,
  LocalGasStation,
  Battery50,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { dashboardAPI } from '@/lib/dashboardApi';
import { Vehicle } from '@/lib/types';

export default function VehicleList() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockVehicles: Vehicle[] = Array.from({ length: 50 }, (_, i) => ({
        id: `VEH-${1000 + i}`,
        name: `Vehicle ${i + 1}`,
        type: ['car', 'motorcycle', 'van', 'bicycle'][Math.floor(Math.random() * 4)] as any,
        license_plate: `ABC-${1000 + i}`,
        model: ['Toyota Corolla', 'Honda Civic', 'Ford Transit', 'Yamaha YBR'][Math.floor(Math.random() * 4)],
        year: 2018 + Math.floor(Math.random() * 5),
        status: ['active', 'maintenance', 'inactive'][Math.floor(Math.random() * 3)] as any,
        last_maintenance_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        next_maintenance_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_driver_id: Math.random() > 0.3 ? `DRV-${1000 + i}` : undefined,
        assigned_driver_name: Math.random() > 0.3 ? `Driver ${i + 1}` : undefined,
        fuel_level: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : undefined,
        battery_level: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : undefined,
        mileage: Math.floor(Math.random() * 50000) + 10000,
        purchase_date: new Date(Date.now() - Math.random() * 1000 * 24 * 60 * 60 * 1000).toISOString(),
        insurance_expiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        registration_expiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, vehicle: Vehicle) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleEditVehicle = () => {
    if (selectedVehicle) {
      router.push(`/dashboard/vehicles/edit/${selectedVehicle.id}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    // In a real app, we would call the API to delete the vehicle
    if (selectedVehicle) {
      setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
    }
    setDeleteConfirmOpen(false);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };

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
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'maintenance':
        return 'In Maintenance';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isMaintenanceDue = (vehicle: Vehicle) => {
    const nextMaintenance = new Date(vehicle.next_maintenance_date);
    const today = new Date();
    const diffTime = nextMaintenance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.assigned_driver_name && 
        vehicle.assigned_driver_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate vehicles
  const paginatedVehicles = filteredVehicles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            size="small"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              size="small"
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<DirectionsCar />}
              size="small"
              onClick={() => router.push('/dashboard/vehicles/new')}
            >
              Add Vehicle
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Vehicles Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="vehicles table">
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>License Plate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Last Maintenance</TableCell>
              <TableCell>Next Maintenance</TableCell>
              <TableCell>Fuel/Battery</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVehicles.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getVehicleIcon(vehicle.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">{vehicle.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.model} ({vehicle.year})
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{vehicle.license_plate}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(vehicle.status)}
                    color={getStatusColor(vehicle.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {vehicle.assigned_driver_name || (
                    <Typography variant="body2" color="text.secondary">
                      Not Assigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{formatDate(vehicle.last_maintenance_date)}</TableCell>
                <TableCell>
                  {isMaintenanceDue(vehicle) ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Warning color="warning" fontSize="small" />
                      <Typography color="warning.main">
                        {formatDate(vehicle.next_maintenance_date)}
                      </Typography>
                    </Stack>
                  ) : (
                    formatDate(vehicle.next_maintenance_date)
                  )}
                </TableCell>
                <TableCell>
                  {vehicle.fuel_level !== undefined ? (
                    <Tooltip title={`Fuel Level: ${vehicle.fuel_level}%`}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalGasStation color="primary" fontSize="small" sx={{ mr: 1 }} />
                        <LinearProgress
                          variant="determinate"
                          value={vehicle.fuel_level}
                          sx={{ width: 50, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Tooltip>
                  ) : vehicle.battery_level !== undefined ? (
                    <Tooltip title={`Battery Level: ${vehicle.battery_level}%`}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Battery50 color="primary" fontSize="small" sx={{ mr: 1 }} />
                        <LinearProgress
                          variant="determinate"
                          value={vehicle.battery_level}
                          sx={{ width: 50, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      N/A
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    onClick={(e) => handleMenuClick(e, vehicle)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVehicles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleEditVehicle}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => router.push(`/dashboard/maintenance/schedule/${selectedVehicle?.id}`)}>
          <Build fontSize="small" sx={{ mr: 1 }} /> Schedule Maintenance
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Vehicle Details Dialog */}
      {selectedVehicle && (
        <Dialog
          open={detailsOpen}
          onClose={handleDetailsClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {getVehicleIcon(selectedVehicle.type)}
              </Avatar>
              <Typography variant="h6">{selectedVehicle.name}</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Vehicle Information
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Model:
                    </Typography>
                    <Typography variant="body2">
                      {selectedVehicle.model} ({selectedVehicle.year})
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      License Plate:
                    </Typography>
                    <Typography variant="body2">
                      {selectedVehicle.license_plate}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Type:
                    </Typography>
                    <Typography variant="body2">
                      {selectedVehicle.type.charAt(0).toUpperCase() + selectedVehicle.type.slice(1)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedVehicle.status)}
                      color={getStatusColor(selectedVehicle.status) as any}
                      size="small"
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Mileage:
                    </Typography>
                    <Typography variant="body2">
                      {selectedVehicle.mileage.toLocaleString()} km
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Purchase Date:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedVehicle.purchase_date)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Maintenance & Registration
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Last Maintenance:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedVehicle.last_maintenance_date)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Next Maintenance:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={isMaintenanceDue(selectedVehicle) ? 'warning.main' : 'text.primary'}
                    >
                      {formatDate(selectedVehicle.next_maintenance_date)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Insurance Expiry:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedVehicle.insurance_expiry)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Registration Expiry:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedVehicle.registration_expiry)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Assigned Driver:
                    </Typography>
                    <Typography variant="body2">
                      {selectedVehicle.assigned_driver_name || 'Not Assigned'}
                    </Typography>
                  </Stack>
                  {(selectedVehicle.fuel_level !== undefined || selectedVehicle.battery_level !== undefined) && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {selectedVehicle.fuel_level !== undefined ? 'Fuel Level:' : 'Battery Level:'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {selectedVehicle.fuel_level !== undefined ? (
                          <>
                            <LocalGasStation color="primary" fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">{selectedVehicle.fuel_level}%</Typography>
                          </>
                        ) : (
                          <>
                            <Battery50 color="primary" fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">{selectedVehicle.battery_level}%</Typography>
                          </>
                        )}
                      </Box>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailsClose}>Close</Button>
            <Button 
              variant="outlined" 
              startIcon={<Build />}
              onClick={() => {
                handleDetailsClose();
                router.push(`/dashboard/maintenance/schedule/${selectedVehicle.id}`);
              }}
            >
              Schedule Maintenance
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Edit />}
              onClick={() => {
                handleDetailsClose();
                router.push(`/dashboard/vehicles/edit/${selectedVehicle.id}`);
              }}
            >
              Edit Vehicle
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedVehicle?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}