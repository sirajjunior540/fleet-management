// Map-specific badge styles
import { getBadgeStyles } from './common';
import { alpha } from '@mui/material/styles';

// Map location status colors
export const mapLocationColors = {
  currentLocation: '#5ac8fa', // Light blue
  pickup: '#ff9500', // Orange
  delivery: '#34c759', // Green
  waypoint: '#9333ea', // Purple
  incident: '#ff3b30', // Red
  depot: '#1d1d1f', // Dark gray
};

// Traffic condition colors
export const trafficColors = {
  clear: '#34c759', // Green
  moderate: '#ff9500', // Orange
  heavy: '#ff3b30', // Red
  unknown: '#86868b', // Gray
};

// Map location badge styles
export const mapLocationBadges = {
  currentLocation: getBadgeStyles(mapLocationColors.currentLocation, 'filled'),
  pickup: getBadgeStyles(mapLocationColors.pickup, 'light'),
  delivery: getBadgeStyles(mapLocationColors.delivery, 'light'),
  waypoint: getBadgeStyles(mapLocationColors.waypoint, 'outlined'),
  incident: getBadgeStyles(mapLocationColors.incident, 'filled'),
  depot: getBadgeStyles(mapLocationColors.depot, 'outlined'),
};

// Traffic condition badge styles
export const trafficBadges = {
  clear: getBadgeStyles(trafficColors.clear, 'light'),
  moderate: getBadgeStyles(trafficColors.moderate, 'light'),
  heavy: getBadgeStyles(trafficColors.heavy, 'filled'),
  unknown: getBadgeStyles(trafficColors.unknown, 'outlined'),
};

// Map marker styles
export const mapMarkerStyles = {
  // Driver markers
  driverActive: {
    backgroundColor: mapLocationColors.currentLocation,
    color: '#ffffff',
    border: `2px solid ${alpha(mapLocationColors.currentLocation, 0.3)}`,
    boxShadow: `0 2px 8px ${alpha(mapLocationColors.currentLocation, 0.4)}`,
  },
  driverInactive: {
    backgroundColor: '#86868b',
    color: '#ffffff',
    border: '2px solid rgba(134, 134, 139, 0.3)',
    boxShadow: '0 2px 8px rgba(134, 134, 139, 0.4)',
  },
  
  // Location markers
  pickup: {
    backgroundColor: mapLocationColors.pickup,
    color: '#ffffff',
    border: `2px solid ${alpha(mapLocationColors.pickup, 0.3)}`,
    boxShadow: `0 2px 8px ${alpha(mapLocationColors.pickup, 0.4)}`,
  },
  delivery: {
    backgroundColor: mapLocationColors.delivery,
    color: '#ffffff',
    border: `2px solid ${alpha(mapLocationColors.delivery, 0.3)}`,
    boxShadow: `0 2px 8px ${alpha(mapLocationColors.delivery, 0.4)}`,
  },
  waypoint: {
    backgroundColor: '#ffffff',
    color: mapLocationColors.waypoint,
    border: `2px solid ${mapLocationColors.waypoint}`,
    boxShadow: `0 2px 8px ${alpha(mapLocationColors.waypoint, 0.3)}`,
  },
};

// Distance badge styles
export const distanceBadges = {
  nearby: getBadgeStyles('#34c759', 'light'), // Within 1km
  near: getBadgeStyles('#5ac8fa', 'light'), // 1-5km
  moderate: getBadgeStyles('#ff9500', 'light'), // 5-15km
  far: getBadgeStyles('#ff3b30', 'outlined'), // 15km+
};

// ETA badge styles
export const etaBadges = {
  onTime: getBadgeStyles('#34c759', 'light'),
  slight: getBadgeStyles('#ff9500', 'light'), // 5-15 min delay
  delayed: getBadgeStyles('#ff3b30', 'filled'), // 15+ min delay
  early: getBadgeStyles('#5ac8fa', 'light'),
};

// Zone type badge styles
export const zoneBadges = {
  residential: getBadgeStyles('#34c759', 'outlined'),
  commercial: getBadgeStyles('#5ac8fa', 'outlined'),
  industrial: getBadgeStyles('#ff9500', 'outlined'),
  restricted: getBadgeStyles('#ff3b30', 'filled'),
  premium: getBadgeStyles('#9333ea', 'light'),
};

// Helper function to get traffic label
export const getTrafficLabel = (condition: string): string => {
  const labelMap: Record<string, string> = {
    clear: 'Clear',
    moderate: 'Moderate',
    heavy: 'Heavy',
    unknown: 'Unknown',
  };
  
  return labelMap[condition] || condition.charAt(0).toUpperCase() + condition.slice(1);
};

// Helper function to format distance
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Helper function to format ETA
export const formatETA = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};