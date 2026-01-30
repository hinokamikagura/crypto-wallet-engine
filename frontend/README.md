# Crypto Trading Engine - React Dashboard

Modern React dashboard for the Cryptocurrency Wallet & Trading Engine Simulator.

## Features

- 📊 **Real-time Dashboard** - Live order book, recent trades, and wallet balances
- 💰 **Wallet Management** - View balances and deposit funds
- 📈 **Trading Interface** - Place LIMIT and MARKET orders
- 📋 **Order Management** - View and cancel orders
- 🔄 **Auto-refresh** - Real-time updates via polling (WebSocket ready)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for modern UI components
- **React Query** for data fetching and caching
- **Axios** for API calls
- **Socket.io-client** (ready for WebSocket integration)

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

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client and types
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
└── package.json
```

## Features Overview

### Dashboard
- Overview of wallet balances
- Live order book visualization
- Recent trades feed
- Quick stats

### Wallet
- View all wallet balances
- Deposit funds (USDT, BTC, ETH)
- Real-time balance updates

### Trading
- Place LIMIT orders with custom price
- Place MARKET orders for immediate execution
- Order book visualization
- Real-time price updates

### Orders
- View all user orders
- Filter by status
- Cancel open orders
- Order history

## API Integration

The frontend connects to the backend REST API:
- Base URL: `http://localhost:8080/api/v1`
- Configured via Vite proxy in `vite.config.ts`

## Real-time Updates

Currently uses polling for real-time updates. WebSocket integration is ready in `useWebSocket.ts` hook - just connect to your WebSocket server endpoint.

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Part of the Cryptocurrency Wallet & Trading Engine Simulator project.
