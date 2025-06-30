'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as DriversIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ChevronLeft as ChevronLeftIcon,
  DirectionsCar as VehiclesIcon,
  Build as MaintenanceIcon,
  Route as RouteIcon,
  TrendingUp as AnalyticsIcon,
  MyLocation as LiveTrackingIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import theme from "@/styles/theme";
import { authUtils } from '@/lib/auth';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
  chip?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authUtils.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        // Redirect to login page if not authenticated
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authUtils.logout();
    router.push('/login');
  };

  const menuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Live Tracking',
      icon: <LiveTrackingIcon />,
      path: '/dashboard/live-tracking',
      chip: 'Live'
    },
    {
      text: 'Vehicles',
      icon: <VehiclesIcon />,
      path: '/dashboard/vehicles',
    },
    {
      text: 'Drivers',
      icon: <DriversIcon />,
      path: '/dashboard/drivers',
    },
    {
      text: 'Maintenance',
      icon: <MaintenanceIcon />,
      path: '/dashboard/maintenance',
      badge: maintenanceAlerts
    },
    {
      text: 'Routes',
      icon: <RouteIcon />,
      path: '/dashboard/routes',
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/dashboard/analytics',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/dashboard/settings',
    },
  ];

  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/profile'); }}>Profile</MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/settings'); }}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Fleet Management Platform
          </Typography>
          <IconButton
            size="large"
            aria-label="show new notifications"
            color="inherit"
          >
            <Badge badgeContent={maintenanceAlerts} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(open ? {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            } : {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: theme.spacing(7),
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: pathname === item.path ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: pathname === item.path ? 'rgba(0, 113, 227, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    fontWeight: pathname === item.path ? 600 : 400,
                  }} 
                />
                {item.chip && open && (
                  <Chip 
                    label={item.chip} 
                    size="small" 
                    color="success" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.625rem',
                      animation: item.chip === 'Live' ? 'pulse 2s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.6 },
                        '100%': { opacity: 1 },
                      },
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}