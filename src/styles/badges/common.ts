// Common badge utilities and base styles
import { alpha } from '@mui/material/styles';

// Badge variant types
export type BadgeVariant = 'filled' | 'outlined' | 'light';

// Base badge styles
export const baseBadgeStyles = {
  borderRadius: '6px',
  fontWeight: 500,
  fontSize: '0.75rem',
  padding: '2px 8px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
};

// Get badge styles based on color and variant
export const getBadgeStyles = (color: string, variant: BadgeVariant = 'filled') => {
  switch (variant) {
    case 'filled':
      return {
        ...baseBadgeStyles,
        backgroundColor: color,
        color: '#ffffff',
        border: 'none',
      };
    
    case 'outlined':
      return {
        ...baseBadgeStyles,
        backgroundColor: 'transparent',
        color: color,
        border: `1px solid ${color}`,
      };
    
    case 'light':
      return {
        ...baseBadgeStyles,
        backgroundColor: alpha(color, 0.1),
        color: color,
        border: `1px solid ${alpha(color, 0.2)}`,
      };
    
    default:
      return baseBadgeStyles;
  }
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

// Export common badge props for MUI Chip consistency
export const commonChipProps = {
  size: 'small' as const,
  sx: {
    fontWeight: 500,
    borderRadius: '6px',
  },
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