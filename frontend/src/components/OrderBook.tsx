import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { OrderBook as OrderBookType } from '../api/client'

interface OrderBookProps {
  orderBook?: OrderBookType
  compact?: boolean
}

export default function OrderBook({ orderBook, compact = false }: OrderBookProps) {
  if (!orderBook) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No order book data</Typography>
      </Box>
    )
  }

  const displayBids = compact ? orderBook.bids.slice(0, 5) : orderBook.bids.slice(0, 10)
  const displayAsks = compact ? orderBook.asks.slice(0, 5) : orderBook.asks.slice(0, 10)

  return (
    <Box>
      <Table size={compact ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Price</TableCell>
            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              Quantity
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Asks (Sell Orders) */}
          {displayAsks.map((ask, index) => (
            <TableRow
              key={`ask-${index}`}
              sx={{
                background: 'rgba(255, 0, 0, 0.05)',
                '&:hover': { background: 'rgba(255, 0, 0, 0.1)' },
              }}
            >
              <TableCell sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                {parseFloat(ask.price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell align="right">
                {parseFloat(ask.quantity).toLocaleString('en-US', {
                  minimumFractionDigits: 8,
                  maximumFractionDigits: 8,
                })}
              </TableCell>
            </TableRow>
          ))}

          {/* Spread */}
          {displayBids.length > 0 && displayAsks.length > 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center" sx={{ py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Spread:{' '}
                  {(
                    parseFloat(displayAsks[0].price) - parseFloat(displayBids[0].price)
                  ).toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {/* Bids (Buy Orders) */}
          {displayBids.map((bid, index) => (
            <TableRow
              key={`bid-${index}`}
              sx={{
                background: 'rgba(0, 255, 0, 0.05)',
                '&:hover': { background: 'rgba(0, 255, 0, 0.1)' },
              }}
            >
              <TableCell sx={{ color: '#51cf66', fontWeight: 'bold' }}>
                {parseFloat(bid.price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell align="right">
                {parseFloat(bid.quantity).toLocaleString('en-US', {
                  minimumFractionDigits: 8,
                  maximumFractionDigits: 8,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
