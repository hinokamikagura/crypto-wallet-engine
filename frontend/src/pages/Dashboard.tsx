import { useQuery } from 'react-query'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material'
import {
  AccountBalance,
  TrendingUp,
  Assessment,
  AttachMoney,
} from '@mui/icons-material'
import { walletApi, marketDataApi, orderApi, WalletBalance, Order } from '../api/client'
import OrderBook from '../components/OrderBook'
import RecentTrades from '../components/RecentTrades'

interface DashboardProps {
  userId: number
}

export default function Dashboard({ userId }: DashboardProps) {
  const selectedSymbol = 'BTC/USDT'

  const { data: balances } = useQuery(
    ['balances', userId],
    () => walletApi.getBalances(userId),
    { refetchInterval: 5000 }
  )

  const { data: orderBook, isLoading: orderBookLoading } = useQuery(
    ['orderbook', selectedSymbol],
    () => marketDataApi.getOrderBook(selectedSymbol),
    { refetchInterval: 2000 }
  )

  const { data: trades } = useQuery(
    ['trades', selectedSymbol],
    () => marketDataApi.getTrades(selectedSymbol, 20),
    { refetchInterval: 3000 }
  )

  const { data: orders } = useQuery(
    ['orders', userId],
    () => orderApi.getUserOrders(userId),
    { refetchInterval: 5000 }
  )

  const totalBalance = balances?.data.reduce((sum: number, w: WalletBalance) => {
    const balance = parseFloat(w.balance)
    if (w.currency === 'USDT') return sum + balance
    // Convert to USDT (simplified - would use real prices)
    const price = w.currency === 'BTC' ? 50000 : 3000
    return sum + balance * price
  }, 0) || 0

  const openOrders = orders?.data.filter((o: Order) => o.status === 'OPEN' || o.status === 'PARTIAL').length || 0

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoney sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Balance
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="body2" color="text.secondary">
                  Open Orders
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {openOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Assessment sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="body2" color="text.secondary">
                  Active Symbol
                </Typography>
              </Box>
              <Chip label={selectedSymbol} color="primary" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalance sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="body2" color="text.secondary">
                  Wallets
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {balances?.data.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: '#151932', border: '1px solid #2a3a5c' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Order Book - {selectedSymbol}
            </Typography>
            {orderBookLoading ? (
              <LinearProgress />
            ) : (
              <OrderBook orderBook={orderBook?.data} />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: '#151932', border: '1px solid #2a3a5c' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Recent Trades
            </Typography>
            <RecentTrades trades={trades?.data || []} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
