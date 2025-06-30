# Fleet Management Application

A comprehensive fleet management platform for tracking vehicles, drivers, and maintenance.

## Overview

This application is a standalone fleet management platform that was extracted from the main delivery platform. It provides a dedicated interface for managing fleet operations, including:

- Vehicle management
- Driver management
- Maintenance tracking
- Route optimization
- Live tracking
- Analytics and reporting

## Features

- **Dashboard**: Overview of fleet operations with key metrics
- **Vehicle Management**: Track vehicle status, maintenance history, and performance
- **Driver Management**: Manage driver profiles, schedules, and performance
- **Maintenance Tracking**: Schedule and track vehicle maintenance
- **Route Optimization**: Plan and optimize delivery routes
- **Live Tracking**: Real-time tracking of vehicles and drivers
- **Analytics**: Comprehensive reporting and analytics

## Tech Stack

- **Frontend**: Next.js 15, React 18, Material UI
- **State Management**: React Hooks
- **Styling**: Emotion (via Material UI)
- **Maps**: Mapbox GL
- **Charts**: Recharts
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd fleet-management
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3001

## Project Structure

```
fleet-management/
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── drivers/
│   │   │   ├── live-tracking/
│   │   │   ├── maintenance/
│   │   │   ├── routes/
│   │   │   ├── vehicles/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── not-found.tsx
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── dashboardApi.ts
│   │   └── types.ts
│   └── styles/
│       └── theme.ts
├── .env
├── next.config.js
├── package.json
└── tsconfig.json
```

## Authentication

The application uses JWT authentication. The authentication flow is handled by the `auth.ts` file in the `lib` directory. The application shares the same authentication system as the main delivery platform.

## API Integration

The application communicates with the backend API through the `dashboardApi.ts` file in the `lib` directory. This file provides methods for fetching data from the API and handling errors.

## Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## License

This project is proprietary and confidential.# fleet-management
