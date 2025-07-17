import { alpha } from '@mui/material/styles';

// Badge color constants
export const badgeColors = {
  // Status colors
  available: '#34c759', // Apple green
  onDelivery: '#5ac8fa', // Apple light blue
  break: '#ff9500', // Apple orange
  offline: '#ff3b30', // Apple red
  
  // Route status colors
  active: '#5ac8fa',
  planned: '#ff9500',
  completed: '#34c759',
  delayed: '#ff3b30',
  
  // Vehicle status colors
  operational: '#34c759',
  maintenance: '#ff9500',
  outOfService: '#ff3b30',
  
  // General purpose colors
  success: '#34c759',
  info: '#5ac8fa',
  warning: '#ff9500',
  error: '#ff3b30',
  neutral: '#86868b',
};

// Badge variant types
export type BadgeVariant = 'filled' | 'outlined' | 'light';

// Get badge styles based on color and variant
export const getBadgeStyles = (color: string, variant: BadgeVariant = 'filled') => {
  const baseStyles = {
    borderRadius: '6px',
    fontWeight: 500,
    fontSize: '0.75rem',
    padding: '2px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (variant) {
    case 'filled':
      return {
        ...baseStyles,
        backgroundColor: color,
        color: '#ffffff',
        border: 'none',
      };
    
    case 'outlined':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: color,
        border: `1px solid ${color}`,
      };
    
    case 'light':
      return {
        ...baseStyles,
        backgroundColor: alpha(color, 0.1),
        color: color,
        border: `1px solid ${alpha(color, 0.2)}`,
      };
    
    default:
      return baseStyles;
  }
};

// Status-specific badge styles
export const statusBadgeStyles = {
  // Driver status badges
  driverAvailable: getBadgeStyles(badgeColors.available, 'light'),
  driverOnDelivery: getBadgeStyles(badgeColors.onDelivery, 'light'),
  driverBreak: getBadgeStyles(badgeColors.break, 'light'),
  driverOffline: getBadgeStyles(badgeColors.offline, 'light'),
  
  // Route status badges
  routeActive: getBadgeStyles(badgeColors.active, 'filled'),
  routePlanned: getBadgeStyles(badgeColors.planned, 'outlined'),
  routeCompleted: getBadgeStyles(badgeColors.completed, 'light'),
  routeDelayed: getBadgeStyles(badgeColors.delayed, 'filled'),
  
  // Vehicle status badges
  vehicleOperational: getBadgeStyles(badgeColors.operational, 'light'),
  vehicleMaintenance: getBadgeStyles(badgeColors.maintenance, 'outlined'),
  vehicleOutOfService: getBadgeStyles(badgeColors.outOfService, 'filled'),
  
  // General status badges
  success: getBadgeStyles(badgeColors.success, 'light'),
  info: getBadgeStyles(badgeColors.info, 'light'),
  warning: getBadgeStyles(badgeColors.warning, 'light'),
  error: getBadgeStyles(badgeColors.error, 'light'),
  neutral: getBadgeStyles(badgeColors.neutral, 'outlined'),
};

// Dashboard stat chip styles (used in overview cards)
export const dashboardChipStyles = {
  base: {
    height: '24px',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  
  // Translucent chips for dark backgrounds
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    border: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  
  // Colored background chips
  colored: (bgColor: string) => ({
    backgroundColor: alpha(bgColor, 0.1),
    color: bgColor,
    border: `1px solid ${alpha(bgColor, 0.2)}`,
    '&:hover': {
      backgroundColor: alpha(bgColor, 0.15),
    },
  }),
};

// Helper function to get MUI Chip color prop based on status
export const getChipColor = (status: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
  const colorMap: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
    available: 'success',
    on_delivery: 'info',
    break: 'warning',
    offline: 'error',
    active: 'info',
    planned: 'warning',
    completed: 'success',
    delayed: 'error',
    operational: 'success',
    maintenance: 'warning',
    out_of_service: 'error',
  };
  
  return colorMap[status] || 'default';
};

// Helper function to get status label
export const getStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    available: 'Available',
    on_delivery: 'On Delivery',
    break: 'On Break',
    offline: 'Offline',
    active: 'Active',
    planned: 'Planned',
    completed: 'Completed',
    delayed: 'Delayed',
    operational: 'Operational',
    maintenance: 'In Maintenance',
    out_of_service: 'Out of Service',
  };
  
  return labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

// Badge icon size styles
export const badgeIconStyles = {
  small: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  medium: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  large: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
};

// Export common badge props for consistency
export const commonBadgeProps = {
  size: 'small' as const,
  sx: {
    fontWeight: 500,
    borderRadius: '6px',
  },
};