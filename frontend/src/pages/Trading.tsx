import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Alert,
  Card,
  CardContent,
} from '@mui/material'
import { Send, TrendingUp, TrendingDown } from '@mui/icons-material'
import { orderApi, marketDataApi } from '../api/client'
import OrderBook from '../components/OrderBook'

interface TradingProps {
  userId: number
}

export default function Trading({ userId }: TradingProps) {
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [symbol, setSymbol] = useState('BTC/USDT')
  const [baseCurrency, setBaseCurrency] = useState<'BTC' | 'ETH'>('BTC')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const queryClient = useQueryClient()

  const { data: orderBook } = useQuery(
    ['orderbook', symbol],
    () => marketDataApi.getOrderBook(symbol),
    { refetchInterval: 2000 }
  )

  const placeOrderMutation = useMutation(
    (order: any) => orderApi.place(userId, order),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders', userId])
        queryClient.invalidateQueries(['balances', userId])
        queryClient.invalidateQueries(['orderbook', symbol])
        setPrice('')
        setQuantity('')
      },
    }
  )

  const handlePlaceOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) return
    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) return

    placeOrderMutation.mutate({
      type: orderType,
      side,
      baseCurrency,
      quoteCurrency: 'USDT',
      price: orderType === 'LIMIT' ? price : null,
      quantity,
    })
  }

  const bestBid = orderBook?.data.bids[0]?.price
  const bestAsk = orderBook?.data.asks[0]?.price
  const marketPrice = bestBid && bestAsk
    ? ((parseFloat(bestBid) + parseFloat(bestAsk)) / 2).toFixed(2)
    : null

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Trading
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, background: '#151932', border: '1px solid #2a3a5c' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Place Order
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  value={side}
                  exclusive
                  onChange={(_, value) => value && setSide(value)}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="BUY" sx={{ flex: 1 }}>
                    <TrendingUp sx={{ mr: 1 }} />
                    BUY
                  </ToggleButton>
                  <ToggleButton value="SELL" sx={{ flex: 1 }}>
                    <TrendingDown sx={{ mr: 1 }} />
                    SELL
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Symbol"
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value)
                    setBaseCurrency(e.target.value.split('/')[0] as 'BTC' | 'ETH')
                  }}
                >
                  <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                  <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <ToggleButtonGroup
                  value={orderType}
                  exclusive
                  onChange={(_, value) => value && setOrderType(value)}
                  fullWidth
                >
                  <ToggleButton value="LIMIT">LIMIT</ToggleButton>
                  <ToggleButton value="MARKET">MARKET</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {orderType === 'LIMIT' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price (USDT)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    inputProps={{ min: 0, step: '0.01' }}
                    helperText={marketPrice && `Market: ${marketPrice} USDT`}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Quantity (${baseCurrency})`}
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputProps={{ min: 0, step: '0.00000001' }}
                />
              </Grid>

              {orderType === 'LIMIT' && price && quantity && (
                <Grid item xs={12}>
                  <Card sx={{ background: '#1a2342', border: '1px solid #2a3a5c' }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total Cost
                      </Typography>
                      <Typography variant="h6">
                        {(parseFloat(price) * parseFloat(quantity)).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        USDT
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  onClick={handlePlaceOrder}
                  disabled={
                    !quantity ||
                    parseFloat(quantity) <= 0 ||
                    (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) ||
                    placeOrderMutation.isLoading
                  }
                  sx={{ py: 1.5 }}
                >
                  {placeOrderMutation.isLoading ? 'Placing Order...' : `Place ${side} Order`}
                </Button>
              </Grid>

              {placeOrderMutation.isError && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    Failed to place order. Please check your balance and try again.
                  </Alert>
                </Grid>
              )}

              {placeOrderMutation.isSuccess && (
                <Grid item xs={12}>
                  <Alert severity="success">Order placed successfully!</Alert>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, background: '#151932', border: '1px solid #2a3a5c' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Order Book - {symbol}
            </Typography>
            <OrderBook orderBook={orderBook?.data} compact />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
