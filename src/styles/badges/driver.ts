// Driver-specific badge styles
import { getBadgeStyles } from './common';

// Driver status colors
export const driverStatusColors = {
  available: '#34c759', // Apple green
  onDelivery: '#5ac8fa', // Apple light blue
  break: '#ff9500', // Apple orange
  offline: '#ff3b30', // Apple red
};

// Driver status badge styles
export const driverStatusBadges = {
  available: getBadgeStyles(driverStatusColors.available, 'light'),
  onDelivery: getBadgeStyles(driverStatusColors.onDelivery, 'light'),
  break: getBadgeStyles(driverStatusColors.break, 'light'),
  offline: getBadgeStyles(driverStatusColors.offline, 'light'),
};

// Helper function to get MUI Chip color for driver status
export const getDriverChipColor = (status: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
  const colorMap: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
    available: 'success',
    on_delivery: 'info',
    break: 'warning',
    offline: 'error',
  };
  
  return colorMap[status] || 'default';
};

// Helper function to get driver status label
export const getDriverStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    available: 'Available',
    on_delivery: 'On Delivery',
    break: 'On Break',
    offline: 'Offline',
  };
  
  return labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

// Driver performance badge styles
export const driverPerformanceBadges = {
  excellent: getBadgeStyles('#34c759', 'filled'),
  good: getBadgeStyles('#5ac8fa', 'light'),
  average: getBadgeStyles('#ff9500', 'outlined'),
  poor: getBadgeStyles('#ff3b30', 'filled'),
};

// Driver rating badge styles
export const driverRatingBadges = {
  fiveStar: {
    backgroundColor: '#34c759',
    color: '#ffffff',
    fontWeight: 600,
  },
  fourStar: {
    backgroundColor: '#5ac8fa',
    color: '#ffffff',
    fontWeight: 600,
  },
  threeStar: {
    backgroundColor: '#ff9500',
    color: '#ffffff',
    fontWeight: 600,
  },
  lowRating: {
    backgroundColor: '#ff3b30',
    color: '#ffffff',
    fontWeight: 600,
  },
};