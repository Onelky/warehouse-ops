# Warehouse Operations Dashboard

A real-time warehouse operations dashboard that displays current warehouse activity and helps floor staff understand what's happening now, what's at risk, and what to work on next.

## Overview

This dashboard is designed to be displayed on large screens throughout a warehouse and auto-updates as activity changes via WebSocket connections.

## Tech Stack

### Backend (NestJS)
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Socket.io** - Real-time WebSocket communication
- **In-memory storage** - Fast data access (database can be added later)

### Frontend (Next.js)
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time updates
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors

## Features

### Dashboard View (Main Screen)
1. **Summary Metrics** (Top Bar)
   - Total orders (today)
   - Total units
   - Total pallets
   - On-time percentage

2. **Operational Widgets**
   - **Receiving**: Inbound shipments at docks (carrier, pallets, dock, status)
   - **Put Away**: Pallet statistics and warehouse capacity tracking
   - **Picking**: Active orders with assigned pickers and priority scores
   - **Pre-Ship Audit**: Audit statistics with pass/fail rates
   - **Outbound**: Scheduled shipments with at-risk highlighting

3. **Real-Time Updates**
   - Dashboard updates instantly when data changes
   - WebSocket connection with auto-reconnect
   - Visual connection status indicator

### Admin Interface
- Create, view, edit, and delete orders
- Create, view, edit, and delete shipments
- Form validation and error handling
- Changes immediately reflect on dashboard

## Project Structure

```
warehouse-ops/
├── backend/              # NestJS backend (to be implemented)
│   ├── src/
│   │   ├── orders/      # Orders module
│   │   ├── shipments/   # Shipments module
│   │   ├── dashboard/   # Dashboard aggregations
│   │   └── data/        # In-memory store
│   └── package.json
├── frontend/            # Next.js frontend
│   ├── app/            # Pages (App Router)
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities (API, Socket, Types)
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd warehouse-ops
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure backend as needed
   npm run start:dev
   ```
   Backend will run on `http://localhost:3001`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Copy .env.example to .env.local and configure
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

### Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Usage

1. **Dashboard View**: Navigate to `http://localhost:3000`
   - View real-time warehouse operations
   - Monitor all operational stages
   - See at-risk shipments highlighted

2. **Admin Panel**: Click "Admin Panel" or navigate to `http://localhost:3000/admin`
   - Create new orders and shipments
   - Edit existing records
   - Delete records
   - Changes appear on dashboard instantly

## Data Models

### Order
```typescript
{
  id: string;
  status: OrderStatus;
  units: number;
  pallets: number;
  assignedUser?: AssignedUser;
  priorityScore?: number;
  healthScore?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Shipment
```typescript
{
  id: string;
  carrier: Carrier;
  eta: Date;
  actualArrivalTime?: Date;
  pallets: number;
  dock: Dock;
  status: ShipmentStatus;
  flowType: FlowType; // INBOUND | OUTBOUND
  createdAt: Date;
  updatedAt: Date;
  isDelayed: boolean; // Calculated field
}
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/summary` - Summary metrics
- `GET /api/dashboard/receiving` - Receiving shipments
- `GET /api/dashboard/put-away` - Put away statistics
- `GET /api/dashboard/picking` - Picking orders
- `GET /api/dashboard/audit` - Audit statistics
- `GET /api/dashboard/outbound` - Outbound shipments

### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Shipments
- `GET /api/shipments` - List all shipments
- `GET /api/shipments/:id` - Get single shipment
- `POST /api/shipments` - Create shipment
- `PATCH /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Enums
- `GET /api/enums/order-statuses` - Order status values
- `GET /api/enums/shipment-statuses` - Shipment status values
- `GET /api/enums/carriers` - Carrier values
- `GET /api/enums/docks` - Dock values
- `GET /api/enums/flow-types` - Flow type values

## WebSocket Events

### Server → Client
- `order:created` - New order created
- `order:updated` - Order updated
- `shipment:created` - New shipment created
- `shipment:updated` - Shipment updated
- `shipment:deleted` - Shipment deleted
- `dashboard:refresh` - Trigger full refresh

## Architecture Decisions

### Why In-Memory Storage First?
- Faster development and iteration
- Focus on WebSocket functionality (core requirement)
- Easy to add database persistence later (Prisma + SQLite/PostgreSQL)
- Sufficient for trial/demo purposes

### Why Socket.io?
- Built-in reconnection logic
- Room support for future scaling
- Excellent NestJS integration
- Fallback to polling if WebSocket unavailable

### Why React Query?
- Automatic caching and refetching
- Optimistic updates
- Built-in loading and error states
- Works seamlessly with WebSocket invalidation

### Why Axios Interceptors?
- Centralized error handling
- Easy to add authentication later
- Request/response logging
- Consistent API calls

## Future Improvements

- [ ] Add database persistence (Prisma + PostgreSQL)
- [ ] User authentication and authorization
- [ ] Health score calculation formula
- [ ] Individual pallet tracking with locations
- [ ] Historical data and analytics
- [ ] Mobile responsive optimization
- [ ] Barcode scanning integration
- [ ] Print labels for orders/shipments
- [ ] Advanced filtering and search
- [ ] Pagination for large datasets

## Development Notes

- Dashboard designed for large screen displays
- Auto-reconnects WebSocket on connection loss
- Fallback polling every 30 seconds
- Color-coded status indicators
- At-risk highlighting for delayed shipments
- No authentication (as per requirements)
