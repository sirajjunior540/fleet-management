// Vehicle-specific badge styles
import { getBadgeStyles } from './common';

// Vehicle status colors
export const vehicleStatusColors = {
  operational: '#34c759', // Apple green
  maintenance: '#ff9500', // Apple orange
  outOfService: '#ff3b30', // Apple red
  inactive: '#86868b', // Apple gray
};

// Vehicle type colors
export const vehicleTypeColors = {
  car: '#5ac8fa', // Light blue
  motorcycle: '#ff9500', // Orange
  van: '#9333ea', // Purple
  truck: '#1d1d1f', // Dark gray
  bicycle: '#34c759', // Green
};

// Vehicle status badge styles
export const vehicleStatusBadges = {
  operational: getBadgeStyles(vehicleStatusColors.operational, 'light'),
  maintenance: getBadgeStyles(vehicleStatusColors.maintenance, 'outlined'),
  outOfService: getBadgeStyles(vehicleStatusColors.outOfService, 'filled'),
  inactive: getBadgeStyles(vehicleStatusColors.inactive, 'outlined'),
};

// Vehicle type badge styles
export const vehicleTypeBadges = {
  car: getBadgeStyles(vehicleTypeColors.car, 'light'),
  motorcycle: getBadgeStyles(vehicleTypeColors.motorcycle, 'light'),
  van: getBadgeStyles(vehicleTypeColors.van, 'light'),
  truck: getBadgeStyles(vehicleTypeColors.truck, 'outlined'),
  bicycle: getBadgeStyles(vehicleTypeColors.bicycle, 'light'),
};

// Helper function to get MUI Chip color for vehicle status
export const getVehicleChipColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  const colorMap: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    operational: 'success',
    maintenance: 'warning',
    out_of_service: 'error',
    inactive: 'default',
  };
  
  return colorMap[status] || 'default';
};

// Helper function to get vehicle status label
export const getVehicleStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    operational: 'Operational',
    maintenance: 'In Maintenance',
    out_of_service: 'Out of Service',
    inactive: 'Inactive',
  };
  
  return labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

// Vehicle type labels
export const getVehicleTypeLabel = (type: string): string => {
  const labelMap: Record<string, string> = {
    car: 'Car',
    motorcycle: 'Motorcycle',
    van: 'Van',
    truck: 'Truck',
    bicycle: 'Bicycle',
  };
  
  return labelMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

// Fuel type badge styles
export const fuelTypeBadges = {
  gasoline: getBadgeStyles('#ff9500', 'outlined'),
  diesel: getBadgeStyles('#1d1d1f', 'outlined'),
  electric: getBadgeStyles('#34c759', 'filled'),
  hybrid: getBadgeStyles('#5ac8fa', 'light'),
};