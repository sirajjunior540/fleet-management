import { 
  Driver, 
  Vehicle, 
  MaintenanceRecord, 
  FleetOverview, 
  LiveTrackingData, 
  RouteInfo, 
  FleetAnalytics, 
  MaintenanceAlert, 
  CompanySettings 
} from './types';
import { authUtils } from './auth';

class DashboardAPI {
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Helper method for making authenticated API requests
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await authUtils.makeAuthenticatedRequest(
        `${this.API_BASE_URL}${endpoint}`,
        options
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in API request to ${endpoint}:`, error);
      throw error;
    }
  }

  // Company settings
  async getCompanySettings(): Promise<CompanySettings> {
    return this.request<CompanySettings>('/api/v1/company/settings/');
  }

  // Fleet Overview
  async getFleetOverview(): Promise<FleetOverview> {
    return this.request<FleetOverview>('/api/v1/fleet/overview/');
  }

  // Vehicles
  async getVehicles(params?: { status?: string; type?: string }): Promise<Vehicle[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<Vehicle[]>(`/api/v1/fleet-management/vehicles/${queryString}`);
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    return this.request<Vehicle>(`/api/v1/fleet-management/vehicles/${id}/`);
  }

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.request<Vehicle>('/api/v1/fleet-management/vehicles/', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.request<Vehicle>(`/api/v1/fleet-management/vehicles/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.request(`/api/v1/fleet-management/vehicles/${id}/`, {
      method: 'DELETE',
    });
  }

  // Drivers
  async getDrivers(params?: { status?: string; vehicle_type?: string }): Promise<Driver[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vehicle_type) queryParams.append('vehicle_type', params.vehicle_type);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<Driver[]>(`/api/v1/fleet-management/drivers/${queryString}`);
  }

  async getDriverById(id: string): Promise<Driver> {
    return this.request<Driver>(`/api/v1/fleet-management/drivers/${id}/`);
  }

  async updateDriverStatus(id: string, status: { is_available: boolean; is_on_duty: boolean }): Promise<Driver> {
    return this.request<Driver>(`/api/v1/fleet-management/drivers/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify(status),
    });
  }

  // Maintenance
  async getMaintenanceRecords(params?: { vehicle_id?: string; status?: string }): Promise<MaintenanceRecord[]> {
    const queryParams = new URLSearchParams();
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<MaintenanceRecord[]>(`/api/v1/fleet-management/maintenance-records/${queryString}`);
  }

  async getMaintenanceById(id: string): Promise<MaintenanceRecord> {
    return this.request<MaintenanceRecord>(`/api/v1/fleet-management/maintenance-records/${id}/`);
  }

  async createMaintenanceRecord(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    return this.request<MaintenanceRecord>('/api/v1/fleet-management/maintenance-records/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenanceRecord(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    return this.request<MaintenanceRecord>(`/api/v1/fleet-management/maintenance-records/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Maintenance Alerts
  async getMaintenanceAlerts(params?: { priority?: string; status?: string }): Promise<MaintenanceAlert[]> {
    const queryParams = new URLSearchParams();
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<MaintenanceAlert[]>(`/api/v1/fleet-management/maintenance-alerts/${queryString}`);
  }

  async updateAlertStatus(id: string, status: string): Promise<MaintenanceAlert> {
    return this.request<MaintenanceAlert>(`/api/v1/fleet-management/maintenance-alerts/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Live Tracking
  async getLiveTrackingData(): Promise<LiveTrackingData[]> {
    return this.request<LiveTrackingData[]>('/api/v1/fleet-management/live-tracking/latest/');
  }

  async getDriverLocation(driverId: string): Promise<LiveTrackingData> {
    return this.request<LiveTrackingData>(`/api/v1/fleet-management/live-tracking/${driverId}/`);
  }

  // Routes
  async getRoutes(params?: { status?: string; driver_id?: string }): Promise<RouteInfo[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.driver_id) queryParams.append('driver_id', params.driver_id);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<RouteInfo[]>(`/api/v1/fleet-management/driver-routes/${queryString}`);
  }

  async getRouteById(id: string): Promise<RouteInfo> {
    return this.request<RouteInfo>(`/api/v1/fleet-management/driver-routes/${id}/`);
  }

  async createRoute(routeData: Partial<RouteInfo>): Promise<RouteInfo> {
    return this.request<RouteInfo>('/api/v1/fleet-management/driver-routes/', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }

  async updateRoute(id: string, routeData: Partial<RouteInfo>): Promise<RouteInfo> {
    return this.request<RouteInfo>(`/api/v1/fleet-management/driver-routes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(routeData),
    });
  }

  // Analytics
  async getFleetAnalytics(params?: { period?: 'day' | 'week' | 'month' | 'year' }): Promise<FleetAnalytics> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<FleetAnalytics>(`/api/v1/fleet-management/fleet-analytics/${queryString}`);
  }

  // Real API endpoints that match our backend
  async getFleetOverview(): Promise<FleetOverview> {
    try {
      // First try to get real data from the API
      return await this.request<FleetOverview>('/api/v1/fleet-management/fleet-analytics/latest/');
    } catch (error) {
      console.error('Error fetching fleet overview:', error);
      throw error;
    }
  }
}

export const dashboardAPI = new DashboardAPI();
