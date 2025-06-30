# Fleet Management Feature Flags

This document describes how feature flags are implemented in the Fleet Management system.

## Overview

The Fleet Management system uses feature flags to control access to specific features based on tenant settings. This allows for a gradual rollout of features and ensures that tenants only have access to features they have enabled.

## Implementation

Feature flags are stored in the `CompanySettings` object, which is fetched from the backend API. The `CompanySettings` interface is defined in `src/lib/types.ts` and includes the following feature flags:

```typescript
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
```

## How to Use Feature Flags

To implement a feature flag in a component:

1. Fetch the company settings using the `dashboardAPI.getCompanySettings()` method
2. Check the relevant feature flag (e.g., `settings.enable_fleet_management`)
3. Conditionally render the component or feature based on the flag value

### Example

```typescript
import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/dashboardApi';

function FeatureFlaggedComponent() {
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await dashboardAPI.getCompanySettings();
        setFeatureEnabled(settings.enable_fleet_management);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company settings:', err);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!featureEnabled) {
    return <div>Feature not available</div>;
  }

  return <div>Feature content goes here</div>;
}
```

## Live Tracking Page Implementation

The Live Tracking page (`src/app/dashboard/live-tracking/page.tsx`) implements feature flag checking to control access to the fleet management feature. The page:

1. Fetches company settings on component mount
2. Checks if `enable_fleet_management` is true
3. If enabled, fetches and displays live tracking data
4. If disabled, shows a "Feature Not Available" message

This ensures that tenants who don't have the fleet management feature enabled cannot access the live tracking functionality.

## Backend Integration

The feature flags are set in the backend and can be managed through the admin dashboard. When a tenant is created or updated, the feature flags can be enabled or disabled based on their subscription plan or specific requirements.

## Best Practices

1. Always check feature flags before fetching or displaying feature-specific data
2. Provide clear feedback to users when a feature is not available
3. Use feature flags for gradual rollout of new features
4. Consider implementing analytics to track feature usage