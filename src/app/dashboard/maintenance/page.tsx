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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Build as MaintenanceIcon,
  Add as AddIcon,
  DirectionsCar as VehicleIcon,
  Person as DriverIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  LocalGasStation as FuelIcon,
  Speed as SpeedIcon,
  AttachMoney as CostIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Mock data for maintenance records
const mockMaintenanceRecords = [
  {
    id: 'MNT-1001',
    vehicleId: 'VEH-1001',
    vehicleName: 'Delivery Van 1',
    type: 'Oil Change',
    status: 'completed',
    date: '2023-06-15',
    cost: 89.99,
    notes: 'Regular maintenance, no issues found.',
    technician: 'John Smith',
    mileage: 15250,
    nextDueDate: '2023-09-15',
    nextDueMileage: 20250,
  },
  {
    id: 'MNT-1002',
    vehicleId: 'VEH-1002',
    vehicleName: 'Delivery Van 2',
    type: 'Tire Replacement',
    status: 'completed',
    date: '2023-05-22',
    cost: 450.00,
    notes: 'Replaced all four tires due to wear.',
    technician: 'Mike Johnson',
    mileage: 32150,
    nextDueDate: '2024-05-22',
    nextDueMileage: 62150,
  },
  {
    id: 'MNT-1003',
    vehicleId: 'VEH-1003',
    vehicleName: 'Cargo Truck 1',
    type: 'Brake Service',
    status: 'scheduled',
    date: '2023-07-05',
    cost: 350.00,
    notes: 'Scheduled brake pad replacement.',
    technician: 'Sarah Williams',
    mileage: 28750,
    nextDueDate: '',
    nextDueMileage: 0,
  },
  {
    id: 'MNT-1004',
    vehicleId: 'VEH-1001',
    vehicleName: 'Delivery Van 1',
    type: 'Annual Inspection',
    status: 'overdue',
    date: '2023-04-10',
    cost: 150.00,
    notes: 'Annual safety and emissions inspection.',
    technician: 'David Brown',
    mileage: 14500,
    nextDueDate: '2023-06-10',
    nextDueMileage: 0,
  },
  {
    id: 'MNT-1005',
    vehicleId: 'VEH-1004',
    vehicleName: 'Cargo Truck 2',
    type: 'Engine Diagnostic',
    status: 'in-progress',
    date: '2023-06-28',
    cost: 120.00,
    notes: 'Check engine light investigation.',
    technician: 'Emily Davis',
    mileage: 42300,
    nextDueDate: '',
    nextDueMileage: 0,
  },
  {
    id: 'MNT-1006',
    vehicleId: 'VEH-1005',
    vehicleName: 'Compact Car 1',
    type: 'Oil Change',
    status: 'upcoming',
    date: '2023-07-15',
    cost: 75.00,
    notes: 'Scheduled regular maintenance.',
    technician: 'John Smith',
    mileage: 8900,
    nextDueDate: '',
    nextDueMileage: 0,
  },
];

// Mock data for vehicles
const mockVehicles = [
  { id: 'VEH-1001', name: 'Delivery Van 1', type: 'van', status: 'active' },
  { id: 'VEH-1002', name: 'Delivery Van 2', type: 'van', status: 'active' },
  { id: 'VEH-1003', name: 'Cargo Truck 1', type: 'truck', status: 'active' },
  { id: 'VEH-1004', name: 'Cargo Truck 2', type: 'truck', status: 'maintenance' },
  { id: 'VEH-1005', name: 'Compact Car 1', type: 'car', status: 'active' },
];

// Mock data for maintenance types
const maintenanceTypes = [
  'Oil Change',
  'Tire Rotation',
  'Tire Replacement',
  'Brake Service',
  'Engine Diagnostic',
  'Battery Replacement',
  'Air Filter Replacement',
  'Fluid Check/Top-up',
  'Annual Inspection',
  'Transmission Service',
  'Other',
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
      id={`maintenance-tabpanel-${index}`}
      aria-labelledby={`maintenance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `maintenance-tab-${index}`,
    'aria-controls': `maintenance-tabpanel-${index}`,
  };
}

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New maintenance record form state
  const [newRecord, setNewRecord] = useState({
    vehicleId: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    notes: '',
    technician: '',
    mileage: '',
    nextDueDate: '',
    nextDueMileage: '',
  });

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setMaintenanceRecords(mockMaintenanceRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form
    setNewRecord({
      vehicleId: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      cost: '',
      notes: '',
      technician: '',
      mileage: '',
      nextDueDate: '',
      nextDueMileage: '',
    });
  };

  const handleCreateRecord = () => {
    if (!newRecord.vehicleId || !newRecord.type) return;
    
    // Create a new maintenance record
    const vehicle = mockVehicles.find(v => v.id === newRecord.vehicleId);
    const newMaintenanceRecord = {
      id: `MNT-${1000 + maintenanceRecords.length + 1}`,
      vehicleId: newRecord.vehicleId,
      vehicleName: vehicle?.name || 'Unknown Vehicle',
      type: newRecord.type,
      status: 'scheduled',
      date: newRecord.date,
      cost: parseFloat(newRecord.cost) || 0,
      notes: newRecord.notes,
      technician: newRecord.technician,
      mileage: parseInt(newRecord.mileage) || 0,
      nextDueDate: newRecord.nextDueDate,
      nextDueMileage: parseInt(newRecord.nextDueMileage) || 0,
    };
    
    setMaintenanceRecords([...maintenanceRecords, newMaintenanceRecord]);
    handleCloseDialog();
    
    // Select the new record
    setSelectedRecord(newMaintenanceRecord);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setNewRecord({
      ...newRecord,
      [name]: value,
    });
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setNewRecord({
        ...newRecord,
        [name]: date.toISOString().split('T')[0],
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'overdue':
        return 'error';
      case 'upcoming':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <RefreshIcon color="warning" />;
      case 'scheduled':
        return <ScheduleIcon color="info" />;
      case 'overdue':
        return <ErrorIcon color="error" />;
      case 'upcoming':
        return <InfoIcon color="primary" />;
      default:
        return <InfoIcon />;
    }
  };

  // Filter records based on search term and active tab
  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = 
      record.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 0) return matchesSearch; // All records
    if (activeTab === 1) return matchesSearch && record.status === 'scheduled'; // Scheduled
    if (activeTab === 2) return matchesSearch && record.status === 'in-progress'; // In Progress
    if (activeTab === 3) return matchesSearch && record.status === 'completed'; // Completed
    if (activeTab === 4) return matchesSearch && (record.status === 'overdue' || record.status === 'upcoming'); // Alerts
    
    return matchesSearch;
  });

  const paginatedRecords = filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              Maintenance Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule, track, and manage vehicle maintenance
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Maintenance Record
          </Button>
        </Stack>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by vehicle, maintenance type, or ID"
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 1 }}><SearchIcon /></Box>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Chip 
                label={`${maintenanceRecords.filter(r => r.status === 'overdue').length} Overdue`} 
                color="error" 
                icon={<WarningIcon />} 
              />
              <Chip 
                label={`${maintenanceRecords.filter(r => r.status === 'upcoming').length} Upcoming`} 
                color="primary" 
                icon={<InfoIcon />} 
              />
              <Chip 
                label={`${maintenanceRecords.filter(r => r.status === 'scheduled').length} Scheduled`} 
                color="info" 
                icon={<ScheduleIcon />} 
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="maintenance tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="All Records"
            icon={<MaintenanceIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Scheduled"
            icon={<ScheduleIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label="In Progress"
            icon={<RefreshIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            label="Completed"
            icon={<CheckCircleIcon />}
            iconPosition="start"
            {...a11yProps(3)}
          />
          <Tab
            label="Alerts"
            icon={<WarningIcon />}
            iconPosition="start"
            {...a11yProps(4)}
          />
        </Tabs>
      </Paper>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Maintenance Records Table */}
      {!loading && (
        <Paper sx={{ width: '100%', mb: 4 }}>
          <TableContainer>
            <Table aria-label="maintenance records table">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Next Due</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow 
                    key={record.id}
                    hover
                    onClick={() => setSelectedRecord(record)}
                    selected={selectedRecord?.id === record.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Tooltip title={record.status}>
                        {getStatusIcon(record.status)}
                      </Tooltip>
                    </TableCell>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.vehicleName}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>${record.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      {record.nextDueDate ? record.nextDueDate : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No maintenance records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRecords.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Selected Record Details */}
      {selectedRecord && (
        <Card sx={{ mb: 4 }}>
          <CardHeader 
            title={`Maintenance Record: ${selectedRecord.id}`}
            subheader={`${selectedRecord.vehicleName} - ${selectedRecord.type}`}
            action={
              <Chip 
                label={selectedRecord.status} 
                color={getStatusColor(selectedRecord.status) as any}
              />
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vehicle
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.vehicleName} ({selectedRecord.vehicleId})
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Maintenance Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.type}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.date}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Technician
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.technician || 'Not assigned'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cost
                    </Typography>
                    <Typography variant="body1">
                      ${selectedRecord.cost.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mileage at Service
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.mileage.toLocaleString()} miles
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Next Due Date
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.nextDueDate || 'Not specified'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Next Due Mileage
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.nextDueMileage ? `${selectedRecord.nextDueMileage.toLocaleString()} miles` : 'Not specified'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Notes
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography variant="body1">
                    {selectedRecord.notes || 'No notes provided'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                  >
                    Edit Record
                  </Button>
                  {selectedRecord.status === 'scheduled' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircleIcon />}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Create Maintenance Record Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Maintenance Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Vehicle</InputLabel>
                <Select
                  name="vehicleId"
                  value={newRecord.vehicleId}
                  label="Vehicle"
                  onChange={handleSelectChange as any}
                >
                  {mockVehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Maintenance Type</InputLabel>
                <Select
                  name="type"
                  value={newRecord.type}
                  label="Maintenance Type"
                  onChange={handleSelectChange as any}
                >
                  {maintenanceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Service Date"
                  value={new Date(newRecord.date)}
                  onChange={(date) => handleDateChange('date', date)}
                  slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                name="cost"
                label="Cost ($)"
                type="number"
                value={newRecord.cost}
                onChange={handleInputChange}
                InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box> }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                name="technician"
                label="Technician"
                value={newRecord.technician}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                name="mileage"
                label="Current Mileage"
                type="number"
                value={newRecord.mileage}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Next Due Date"
                  value={newRecord.nextDueDate ? new Date(newRecord.nextDueDate) : null}
                  onChange={(date) => handleDateChange('nextDueDate', date)}
                  slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                name="nextDueMileage"
                label="Next Due Mileage"
                type="number"
                value={newRecord.nextDueMileage}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={newRecord.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateRecord} 
            variant="contained"
            disabled={!newRecord.vehicleId || !newRecord.type}
          >
            Create Record
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// SearchIcon component for the search field
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}