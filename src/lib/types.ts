// Basic user types
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string;
  role: string;
  phone_number?: string;
  profile_image?: string;
}

// Driver related types
export interface Driver {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_available: boolean;
  vehicle_type: 'car' | 'motorcycle' | 'van' | 'bicycle';
  vehicle_number: string;
  license_number: string;
  total_deliveries: number;
  successful_deliveries: number;
  average_rating: number;
  total_earnings: number;
  is_on_duty: boolean;
  success_rate: number;
  created_at: string;
}

// Vehicle related types
export interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'motorcycle' | 'van' | 'bicycle';
  license_plate: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'inactive';
  last_maintenance_date: string;
  next_maintenance_date: string;
  assigned_driver_id?: string;
  assigned_driver_name?: string;
  fuel_level?: number;
  battery_level?: number;
  mileage: number;
  purchase_date: string;
  insurance_expiry: string;
  registration_expiry: string;
}

// Maintenance related types
export interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  service_type: string;
  description: string;
  service_date: string;
  cost: number;
  performed_by: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  next_service_date?: string;
  next_service_mileage?: number;
}

// Fleet overview types
export interface FleetOverview {
  total_vehicles: number;
  active_vehicles: number;
  maintenance_vehicles: number;
  inactive_vehicles: number;
  total_drivers: number;
  active_drivers: number;
  on_duty_drivers: number;
  off_duty_drivers: number;
  deliveries_today: number;
  deliveries_week: number;
  deliveries_month: number;
  average_delivery_time: number;
  fleet_utilization: number;
}

// Live tracking types
export interface LiveTrackingData {
  driver_id: string;
  driver_name: string;
  vehicle_id: string;
  vehicle_type: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  status: 'idle' | 'on_delivery' | 'returning' | 'offline';
  current_delivery_id?: string;
  battery_level?: number;
  fuel_level?: number;
}

// Route related types
export interface RouteDelivery {
  id: string;
  order_id: string;
  customer_name: string;
  address: string;
  status: string;
  estimated_arrival: string;
  priority: 'low' | 'medium' | 'high';
}

export interface RouteInfo {
  id: string;
  driver_id: string;
  driver_name: string;
  vehicle_id: string;
  start_time: string;
  end_time?: string;
  total_distance: number;
  total_deliveries: number;
  completed_deliveries: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  deliveries: RouteDelivery[];
}

// Analytics related types
export interface FleetAnalytics {
  delivery_times: {
    date: string;
    average_time: number;
  }[];
  vehicle_utilization: {
    vehicle_type: string;
    utilization_rate: number;
    count: number;
  }[];
  driver_performance: {
    driver_id: string;
    driver_name: string;
    deliveries: number;
    rating: number;
    on_time_rate: number;
  }[];
  maintenance_costs: {
    month: string;
    cost: number;
  }[];
  fuel_consumption: {
    month: string;
    consumption: number;
  }[];
}

// Maintenance alert types
export interface MaintenanceAlert {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  alert_type: 'scheduled_maintenance' | 'repair_needed' | 'inspection_due' | 'part_replacement';
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'resolved' | 'ignored';
  created_at: string;
  updated_at: string;
  estimated_cost?: number;
}

// Company settings
export interface CompanySettings {
  id: string;
  company_name: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  enable_fleet_management: boolean;
  enable_route_optimization: boolean;
  enable_maintenance_tracking: boolean;
  enable_driver_app: boolean;
  enable_customer_notifications: boolean;
  default_map_center_lat: number;
  default_map_center_lng: number;
  default_map_zoom: number;
}