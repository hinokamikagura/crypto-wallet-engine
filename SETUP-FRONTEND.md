# Frontend Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### First Time Setup

1. **Start the backend** (if not already running):
   ```bash
   mvn spring-boot:run
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the dashboard**:
   - Open http://localhost:3000
   - Click "Start Trading" to create a demo user
   - Deposit funds and start trading!

## Features

### Dashboard (`/`)
- Overview of wallet balances
- Live order book visualization
- Recent trades feed
- Quick stats

### Wallet (`/wallet`)
- View all wallet balances (USDT, BTC, ETH)
- Deposit funds
- Real-time balance updates

### Trading (`/trading`)
- Place LIMIT orders with custom price
- Place MARKET orders for immediate execution
- Order book visualization
- Real-time price updates

### Orders (`/orders`)
- View all user orders
- Filter by status
- Cancel open orders
- Order history

## API Integration

The frontend connects to the backend REST API:
- Base URL: `http://localhost:8080/api/v1`
- Configured via Vite proxy in `vite.config.ts`

## Environment Variables

Create `frontend/.env` file (optional):

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Building for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` directory.

## Docker

The frontend can also be run via Docker:

```bash
docker-compose up frontend
```

Or build the image:

```bash
cd frontend
docker build -t crypto-wallet-frontend .
docker run -p 3000:3000 crypto-wallet-frontend
```

## Troubleshooting

### CORS Errors
Make sure the backend is running and accessible at `http://localhost:8080`

### API Connection Failed
- Check backend is running: `curl http://localhost:8080/actuator/health`
- Verify API URL in `vite.config.ts` proxy configuration

### Port Already in Use
Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change from 3000
}
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Material-UI (MUI)** for components
- **React Query** for data fetching
- **Axios** for API calls
