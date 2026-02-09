# Warehouse Operations Dashboard - Frontend

Next.js frontend application for real-time warehouse operations monitoring.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time WebSocket communication
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client with interceptors

## Features

### Dashboard (Main View)
- **Summary Metrics**: Total orders, units, pallets, and on-time percentage
- **Receiving Widget**: Inbound shipments at docks
- **Put Away Widget**: Pallet statistics and warehouse capacity
- **Picking Widget**: Active picking orders with assigned pickers
- **Audit Widget**: Pre-ship audit statistics and pass rates
- **Outbound Widget**: Scheduled outbound shipments with at-risk highlighting
- **Real-time Updates**: Auto-updates via WebSocket when data changes
- **Connection Status**: Visual indicator showing WebSocket connection state

### Admin Panel
- **Orders Management**: Create, view, edit, and delete orders
- **Shipments Management**: Create, view, edit, and delete shipments
- **Form Validation**: Client-side validation for all inputs
- **Real-time Sync**: Changes immediately reflect on dashboard

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard (main view)
│   ├── layout.tsx           # Root layout
│   ├── providers.tsx        # React Query provider
│   └── admin/               # Admin panel pages
│       ├── page.tsx         # Admin home
│       ├── orders/          # Orders management
│       └── shipments/       # Shipments management
├── components/
│   ├── dashboard/           # Dashboard widgets
│   │   ├── SummaryMetrics.tsx
│   │   ├── ReceivingWidget.tsx
│   │   ├── PutAwayWidget.tsx
│   │   ├── PickingWidget.tsx
│   │   ├── AuditWidget.tsx
│   │   ├── OutboundWidget.tsx
│   │   └── ConnectionStatus.tsx
│   └── admin/               # Admin form components
│       ├── OrderForm.tsx
│       └── ShipmentForm.tsx
├── hooks/                   # Custom React hooks
│   ├── useSocket.ts         # WebSocket connection
│   ├── useDashboard.ts      # Dashboard data fetching
│   ├── useOrders.ts         # Orders CRUD operations
│   └── useShipments.ts      # Shipments CRUD operations
├── lib/                     # Core utilities
│   ├── api.ts              # Axios client with interceptors
│   ├── socket.ts           # Socket.io client setup
│   └── types.ts            # TypeScript interfaces and enums
└── public/                  # Static assets
```

## Real-Time Updates

The dashboard automatically updates when:
- A new order is created
- An order status changes
- A new shipment is created
- A shipment status changes
- Any data is deleted

WebSocket events handled:
- `order:created`
- `order:updated`
- `order:deleted`
- `shipment:created`
- `shipment:updated`
- `shipment:deleted`
- `dashboard:refresh`

## API Integration

All API calls use Axios with interceptors for:
- Automatic base URL configuration
- Request/response logging
- Error handling
- Future authentication token injection

## Styling

- Built with Tailwind CSS
- Responsive design (mobile-first)
- Color-coded status badges
- At-risk highlighting for delayed shipments
- Loading skeletons for better UX

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The dashboard is designed for large screen displays in warehouses
- Auto-reconnects to WebSocket if connection is lost
- Fallback polling every 30 seconds if WebSocket fails
- No authentication required (as per project requirements)
