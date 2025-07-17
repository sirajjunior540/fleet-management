// Order-specific badge styles
import { getBadgeStyles } from './common';

// Order status colors
export const orderStatusColors = {
  pending: '#ff9500', // Orange
  assigned: '#5ac8fa', // Light blue
  inTransit: '#9333ea', // Purple
  delivered: '#34c759', // Green
  failed: '#ff3b30', // Red
  cancelled: '#86868b', // Gray
};

// Order priority colors
export const orderPriorityColors = {
  express: '#ff3b30', // Red
  priority: '#ff9500', // Orange
  standard: '#5ac8fa', // Light blue
  economy: '#86868b', // Gray
};

// Order status badge styles
export const orderStatusBadges = {
  pending: getBadgeStyles(orderStatusColors.pending, 'outlined'),
  assigned: getBadgeStyles(orderStatusColors.assigned, 'light'),
  inTransit: getBadgeStyles(orderStatusColors.inTransit, 'filled'),
  delivered: getBadgeStyles(orderStatusColors.delivered, 'light'),
  failed: getBadgeStyles(orderStatusColors.failed, 'filled'),
  cancelled: getBadgeStyles(orderStatusColors.cancelled, 'outlined'),
};

// Order priority badge styles
export const orderPriorityBadges = {
  express: getBadgeStyles(orderPriorityColors.express, 'filled'),
  priority: getBadgeStyles(orderPriorityColors.priority, 'light'),
  standard: getBadgeStyles(orderPriorityColors.standard, 'outlined'),
  economy: getBadgeStyles(orderPriorityColors.economy, 'outlined'),
};

// Payment status badge styles
export const paymentStatusBadges = {
  paid: getBadgeStyles('#34c759', 'light'),
  pending: getBadgeStyles('#ff9500', 'outlined'),
  cod: getBadgeStyles('#5ac8fa', 'filled'),
  failed: getBadgeStyles('#ff3b30', 'filled'),
  refunded: getBadgeStyles('#86868b', 'outlined'),
};

// Special handling badge styles
export const specialHandlingBadges = {
  fragile: getBadgeStyles('#ff3b30', 'outlined'),
  perishable: getBadgeStyles('#ff9500', 'light'),
  hazardous: getBadgeStyles('#ff3b30', 'filled'),
  oversized: getBadgeStyles('#9333ea', 'outlined'),
  temperatureControlled: getBadgeStyles('#5ac8fa', 'filled'),
};

// Helper function to get MUI Chip color for order status
export const getOrderChipColor = (status: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
  const colorMap: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
    pending: 'warning',
    assigned: 'info',
    in_transit: 'info',
    delivered: 'success',
    failed: 'error',
    cancelled: 'default',
  };
  
  return colorMap[status] || 'default';
};

// Helper function to get order status label
export const getOrderStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  
  return labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

// Order type badge styles
export const orderTypeBadges = {
  standard: getBadgeStyles('#5ac8fa', 'outlined'),
  express: getBadgeStyles('#ff3b30', 'filled'),
  sameDay: getBadgeStyles('#ff9500', 'filled'),
  scheduled: getBadgeStyles('#9333ea', 'light'),
  recurring: getBadgeStyles('#34c759', 'light'),
};