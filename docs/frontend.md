# Frontend Documentation

## Overview

The React dashboard provides a modern, user-friendly interface for the Cryptocurrency Wallet & Trading Engine Simulator. Built with React 18, TypeScript, and Material-UI, it offers real-time updates, intuitive trading interfaces, and comprehensive wallet management.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Material-UI (MUI)** v5 for modern UI components
- **React Query** for efficient data fetching and caching
- **Axios** for HTTP requests
- **React Router** for navigation
- **Socket.io-client** (ready for WebSocket integration)

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts              # API client with TypeScript types
│   ├── components/
│   │   ├── OrderBook.tsx          # Order book visualization
│   │   ├── RecentTrades.tsx       # Recent trades table
│   │   └── Navigation.tsx         # Bottom navigation bar
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── Wallet.tsx             # Wallet management
│   │   ├── Trading.tsx            # Order placement
│   │   └── Orders.tsx             # Order history
│   ├── hooks/
│   │   └── useWebSocket.ts        # WebSocket hook (ready for integration)
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
├── public/                        # Static assets
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
└── tsconfig.json                  # TypeScript config
```

## Features

### Dashboard (`/`)
- **Overview Cards**: Total balance, open orders count, active symbol
- **Live Order Book**: Real-time bid/ask visualization
- **Recent Trades**: Latest trade executions
- **Auto-refresh**: Updates every 2-5 seconds

### Wallet (`/wallet`)
- **Balance Display**: View all wallet balances (USDT, BTC, ETH)
- **Deposit Modal**: Add funds to any currency
- **Real-time Updates**: Balance refreshes automatically
- **Value Conversion**: Shows USDT equivalent for crypto balances

### Trading (`/trading`)
- **Order Types**: LIMIT and MARKET orders
- **Order Side**: BUY or SELL toggle
- **Symbol Selection**: BTC/USDT or ETH/USDT
- **Price Input**: Custom price for LIMIT orders
- **Quantity Input**: Amount to trade
- **Order Book Sidebar**: Live order book for reference
- **Total Cost Display**: Shows total cost for LIMIT orders
- **Market Price Helper**: Displays current market price

### Orders (`/orders`)
- **Order List**: All user orders in a table
- **Status Chips**: Color-coded status (OPEN, PARTIAL, FILLED, CANCELLED)
- **Order Details**: Price, quantity, filled quantity, timestamp
- **Cancel Action**: Cancel open/partial orders
- **Auto-refresh**: Updates every 5 seconds

## API Integration

### Base Configuration
- **API URL**: `http://localhost:8080/api/v1`
- **Proxy**: Configured in `vite.config.ts` for development
- **CORS**: Handled by backend CORS configuration

### API Endpoints Used

#### User Management
- `POST /users` - Create user
- `GET /users/{id}` - Get user details

#### Wallet
- `GET /wallets/balances?userId={id}` - Get all balances
- `GET /wallets/balance?userId={id}&currency={currency}` - Get specific balance
- `POST /wallets/deposit?userId={id}&currency={currency}` - Deposit funds

#### Orders
- `POST /orders?userId={id}` - Place order
- `GET /orders?userId={id}` - Get user orders
- `GET /orders/{id}?userId={id}` - Get order details
- `POST /orders/{id}/cancel?userId={id}` - Cancel order

#### Market Data
- `GET /market/orderbook/{symbol}` - Get order book
- `GET /market/trades/{symbol}?limit={limit}` - Get recent trades

## Real-time Updates

### Current Implementation
- Uses **React Query** polling for real-time updates
- Polling intervals:
  - Order book: 2 seconds
  - Recent trades: 3 seconds
  - Wallet balances: 5 seconds
  - User orders: 5 seconds

### WebSocket Integration (Ready)
The `useWebSocket` hook is implemented and ready for WebSocket integration:

```typescript
// In useWebSocket.ts
export const useWebSocket = () => {
  // Currently simulates connection
  // Ready to connect to WebSocket server
}
```

To enable WebSocket:
1. Add WebSocket endpoint to backend
2. Update `useWebSocket.ts` to connect to WebSocket server
3. Replace polling with WebSocket subscriptions

## State Management

### React Query
- **Caching**: Automatic caching of API responses
- **Refetching**: Configurable refetch intervals
- **Optimistic Updates**: Mutations update cache immediately
- **Error Handling**: Built-in error states

### Local State
- Form inputs (price, quantity, etc.)
- UI state (modals, navigation)
- User ID (stored in localStorage)

## Styling

### Theme
- **Dark Theme**: Custom dark theme with crypto-trading aesthetic
- **Primary Color**: Cyan (`#00d4ff`)
- **Background**: Dark blue (`#0a0e27`, `#151932`)
- **Typography**: Inter font family

### Components
- Material-UI components with custom styling
- Responsive grid layouts
- Custom scrollbars
- Hover effects and transitions

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
- Runs on http://localhost:3000
- Hot module replacement enabled
- API proxy configured

### Build
```bash
npm run build
```
- Output: `dist/` directory
- Optimized for production
- TypeScript compilation
- Asset optimization

### Preview Production Build
```bash
npm run preview
```

## Testing

### Manual Testing Checklist
- ✅ User creation flow
- ✅ Wallet deposit functionality
- ✅ Order placement (LIMIT and MARKET)
- ✅ Order cancellation
- ✅ Order book display
- ✅ Recent trades display
- ✅ Balance updates
- ✅ Navigation between pages
- ✅ Responsive design

### Build Verification
```bash
npm run build
```
- ✅ TypeScript compilation successful
- ✅ No build errors
- ✅ Assets optimized
- ✅ Production bundle created

## Deployment

### Docker
```bash
docker build -t crypto-wallet-frontend ./frontend
docker run -p 3000:3000 crypto-wallet-frontend
```

### Static Hosting
Build the project and deploy the `dist/` directory to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

### Bundle Size
- **Production Build**: ~550 KB (gzipped: ~171 KB)
- **CSS**: ~1 KB (gzipped: ~0.5 KB)
- **Optimizations**: Code splitting, tree shaking, minification

### Optimization Strategies
- React Query caching reduces API calls
- Lazy loading for routes (ready for implementation)
- Image optimization
- Code splitting (ready for implementation)

## Known Issues & Future Improvements

### Current Limitations
- Uses polling instead of WebSocket (WebSocket hook ready)
- No authentication (demo mode)
- No error boundaries (can be added)
- No loading skeletons (can be added)

### Planned Improvements
- WebSocket integration for real-time updates
- Authentication and authorization
- Error boundaries for better error handling
- Loading skeletons for better UX
- Order history charts and analytics
- Multi-language support
- PWA support

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured
- Check API URL in `vite.config.ts`

### API Connection Failed
- Verify backend is running: `curl http://localhost:8080/actuator/health`
- Check network tab in browser DevTools

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript version compatibility

### Port Already in Use
- Change port in `vite.config.ts`:
  ```typescript
  server: {
    port: 3001
  }
  ```
