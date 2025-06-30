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
  Rating,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Phone,
  Message,
  LocationOn,
  Assignment,
  CheckCircle,
  Cancel,
  DirectionsCar,
  TwoWheeler,
  LocalShipping,
  DirectionsBike,
  TrendingUp,
  TrendingDown,
  Edit,
  Delete,
  Visibility,
  Add,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { dashboardAPI } from '@/lib/dashboardApi';
import { Driver } from '@/lib/types';

interface DriverListDriver extends Driver {
  status: 'available' | 'on_delivery' | 'offline' | 'break';
  performance: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

export default function DriverList() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<DriverListDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverListDriver | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockDrivers: DriverListDriver[] = Array.from({ length: 50 }, (_, i) => ({
        id: `DRV-${1000 + i}`,
        username: `driver${i + 1}`,
        first_name: `Driver`,
        last_name: `${i + 1}`,
        email: `driver${i + 1}@company.com`,
        phone_number: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        is_available: Math.random() > 0.3,
        vehicle_type: ['car', 'motorcycle', 'van', 'bicycle'][Math.floor(Math.random() * 4)] as any,
        vehicle_number: `VEH-${1000 + i}`,
        license_number: `DL-${100000 + i}`,
        total_deliveries: Math.floor(Math.random() * 1000) + 100,
        successful_deliveries: Math.floor(Math.random() * 950) + 50,
        average_rating: 4 + Math.random(),
        total_earnings: Math.floor(Math.random() * 50000) + 10000,
        is_on_duty: Math.random() > 0.2,
        success_rate: 85 + Math.random() * 15,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: ['available', 'on_delivery', 'offline', 'break'][Math.floor(Math.random() * 4)] as any,
        performance: {
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
          percentage: Math.floor(Math.random() * 20) + 1,
        },
      }));
      setDrivers(mockDrivers);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, driver: DriverListDriver) => {
    setAnchorEl(event.currentTarget);
    setSelectedDriver(driver);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleEditDriver = () => {
    if (selectedDriver) {
      router.push(`/dashboard/drivers/edit/${selectedDriver.id}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    // In a real app, we would call the API to delete the driver
    if (selectedDriver) {
      setDrivers(drivers.filter(d => d.id !== selectedDriver.id));
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
      case 'available':
        return 'success';
      case 'on_delivery':
        return 'info';
      case 'break':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'on_delivery':
        return 'On Delivery';
      case 'break':
        return 'On Break';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
  };

  const getPerformanceIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone_number.includes(searchTerm) ||
      driver.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate drivers
  const paginatedDrivers = filteredDrivers.slice(
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
            placeholder="Search drivers..."
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
              startIcon={<Add />}
              size="small"
              onClick={() => router.push('/dashboard/drivers/new')}
            >
              Add Driver
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Drivers Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="drivers table">
          <TableHead>
            <TableRow>
              <TableCell>Driver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Deliveries</TableCell>
              <TableCell>Success Rate</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDrivers.map((driver) => (
              <TableRow
                key={driver.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: getStatusColor(driver.status) + '.main' }}>
                      {driver.first_name.charAt(0) + driver.last_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">{driver.first_name} {driver.last_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {driver.phone_number}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(driver.status)}
                    color={getStatusColor(driver.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {getVehicleIcon(driver.vehicle_type)}
                    <Typography variant="body2">
                      {driver.vehicle_number}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating value={driver.average_rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2">
                      ({driver.average_rating.toFixed(1)})
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {driver.successful_deliveries} / {driver.total_deliveries}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinearProgress
                      variant="determinate"
                      value={driver.success_rate}
                      sx={{ width: 60, height: 6, borderRadius: 3, mr: 1 }}
                    />
                    <Typography variant="body2">
                      {driver.success_rate.toFixed(1)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {getPerformanceIcon(driver.performance.trend)}
                    <Typography 
                      variant="body2" 
                      color={driver.performance.trend === 'up' ? 'success.main' : driver.performance.trend === 'down' ? 'error.main' : 'text.secondary'}
                    >
                      {driver.performance.trend === 'stable' ? 'Stable' : `${driver.performance.percentage}%`}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    onClick={(e) => handleMenuClick(e, driver)}
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
          count={filteredDrivers.length}
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
        <MenuItem onClick={handleEditDriver}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (selectedDriver) {
            router.push(`/dashboard/routes/assign/${selectedDriver.id}`);
          }
        }}>
          <Assignment fontSize="small" sx={{ mr: 1 }} /> Assign Route
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (selectedDriver) {
            window.location.href = `tel:${selectedDriver.phone_number}`;
          }
        }}>
          <Phone fontSize="small" sx={{ mr: 1 }} /> Call
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Driver Details Dialog */}
      {selectedDriver && (
        <Dialog
          open={detailsOpen}
          onClose={handleDetailsClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: getStatusColor(selectedDriver.status) + '.main', width: 56, height: 56 }}>
                {selectedDriver.first_name.charAt(0) + selectedDriver.last_name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedDriver.first_name} {selectedDriver.last_name}</Typography>
                <Chip 
                  label={getStatusLabel(selectedDriver.status)} 
                  color={getStatusColor(selectedDriver.status) as any} 
                  size="small" 
                />
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Email:
                    </Typography>
                    <Typography variant="body2">
                      {selectedDriver.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Phone:
                    </Typography>
                    <Typography variant="body2">
                      {selectedDriver.phone_number}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      License Number:
                    </Typography>
                    <Typography variant="body2">
                      {selectedDriver.license_number}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Joined:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedDriver.created_at)}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Vehicle Information
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Vehicle Type:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getVehicleIcon(selectedDriver.vehicle_type)}
                      <Typography variant="body2">
                        {selectedDriver.vehicle_type.charAt(0).toUpperCase() + selectedDriver.vehicle_type.slice(1)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Vehicle Number:
                    </Typography>
                    <Typography variant="body2">
                      {selectedDriver.vehicle_number}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Performance Metrics
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Rating:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating value={selectedDriver.average_rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2">
                        ({selectedDriver.average_rating.toFixed(1)})
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total Deliveries:
                    </Typography>
                    <Typography variant="body2">
                      {selectedDriver.total_deliveries}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Successful Deliveries:
                    </Typography>
                    <Typography variant="body2">
                      {selectedDriver.successful_deliveries}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Success Rate:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={selectedDriver.success_rate}
                        sx={{ width: 60, height: 6, borderRadius: 3, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {selectedDriver.success_rate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Performance Trend:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {getPerformanceIcon(selectedDriver.performance.trend)}
                      <Typography 
                        variant="body2" 
                        color={selectedDriver.performance.trend === 'up' ? 'success.main' : selectedDriver.performance.trend === 'down' ? 'error.main' : 'text.secondary'}
                      >
                        {selectedDriver.performance.trend === 'stable' ? 'Stable' : `${selectedDriver.performance.percentage}% ${selectedDriver.performance.trend === 'up' ? 'Increase' : 'Decrease'}`}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total Earnings:
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(selectedDriver.total_earnings)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailsClose}>Close</Button>
            <Button 
              variant="outlined" 
              startIcon={<Phone />}
              onClick={() => {
                window.location.href = `tel:${selectedDriver.phone_number}`;
              }}
            >
              Call
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Assignment />}
              onClick={() => {
                handleDetailsClose();
                router.push(`/dashboard/routes/assign/${selectedDriver.id}`);
              }}
            >
              Assign Route
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Edit />}
              onClick={() => {
                handleDetailsClose();
                router.push(`/dashboard/drivers/edit/${selectedDriver.id}`);
              }}
            >
              Edit Driver
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
            Are you sure you want to delete {selectedDriver?.first_name} {selectedDriver?.last_name}? This action cannot be undone.
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