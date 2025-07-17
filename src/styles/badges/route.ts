// Route-specific badge styles
import { getBadgeStyles } from './common';

// Route status colors
export const routeStatusColors = {
  active: '#5ac8fa', // Apple light blue
  planned: '#ff9500', // Apple orange
  completed: '#34c759', // Apple green
  delayed: '#ff3b30', // Apple red
  cancelled: '#86868b', // Apple gray
};

// Route priority colors
export const routePriorityColors = {
  urgent: '#ff3b30', // Red
  high: '#ff9500', // Orange
  normal: '#5ac8fa', // Light blue
  low: '#86868b', // Gray
};

// Route status badge styles
export const routeStatusBadges = {
  active: getBadgeStyles(routeStatusColors.active, 'filled'),
  planned: getBadgeStyles(routeStatusColors.planned, 'outlined'),
  completed: getBadgeStyles(routeStatusColors.completed, 'light'),
  delayed: getBadgeStyles(routeStatusColors.delayed, 'filled'),
  cancelled: getBadgeStyles(routeStatusColors.cancelled, 'outlined'),
};

// Route priority badge styles
export const routePriorityBadges = {
  urgent: getBadgeStyles(routePriorityColors.urgent, 'filled'),
  high: getBadgeStyles(routePriorityColors.high, 'light'),
  normal: getBadgeStyles(routePriorityColors.normal, 'outlined'),
  low: getBadgeStyles(routePriorityColors.low, 'outlined'),
};

// Helper function to get MUI Chip color for route status
export const getRouteChipColor = (status: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
  const colorMap: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
    active: 'info',
    planned: 'warning',
    completed: 'success',
    delayed: 'error',
    cancelled: 'default',
  };
  
  return colorMap[status] || 'default';
};

// Helper function to get route status label
export const getRouteStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    active: 'Active',
    planned: 'Planned',
    completed: 'Completed',
    delayed: 'Delayed',
    cancelled: 'Cancelled',
  };
  
  return labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

// Route type badge styles
export const routeTypeBadges = {
  delivery: getBadgeStyles('#5ac8fa', 'light'),
  pickup: getBadgeStyles('#9333ea', 'light'),
  roundTrip: getBadgeStyles('#ff9500', 'light'),
  multiStop: getBadgeStyles('#34c759', 'light'),
};

// Route optimization badge styles
export const routeOptimizationBadges = {
  optimized: {
    backgroundColor: '#34c759',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  manual: {
    backgroundColor: '#86868b',
    color: '#ffffff',
    fontWeight: 500,
    fontSize: '0.7rem',
  },
  reOptimizing: {
    backgroundColor: '#ff9500',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
};