import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Trade } from '../api/client'
import { format } from 'date-fns'

interface RecentTradesProps {
  trades: Trade[]
}

export default function RecentTrades({ trades }: RecentTradesProps) {
  if (trades.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No recent trades</Typography>
      </Box>
    )
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Price</TableCell>
          <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            Quantity
          </TableCell>
          <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            Time
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {trades.slice(0, 10).map((trade) => (
          <TableRow key={trade.id} hover>
            <TableCell sx={{ fontWeight: 'bold' }}>
              {parseFloat(trade.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell align="right">
              {parseFloat(trade.quantity).toLocaleString('en-US', {
                minimumFractionDigits: 8,
                maximumFractionDigits: 8,
              })}
            </TableCell>
            <TableCell align="right">
              <Typography variant="caption">
                {format(new Date(trade.timestamp), 'HH:mm:ss')}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
