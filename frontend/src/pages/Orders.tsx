import React from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Cancel, CheckCircle, Schedule } from '@mui/icons-material'
import { orderApi } from '../api/client'
import { format } from 'date-fns'

interface OrdersProps {
  userId: number
}

export default function Orders({ userId }: OrdersProps) {
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery(
    ['orders', userId],
    () => orderApi.getUserOrders(userId),
    { refetchInterval: 5000 }
  )

  const cancelMutation = useMutation(
    (orderId: number) => orderApi.cancel(userId, orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders', userId])
        queryClient.invalidateQueries(['balances', userId])
      },
    }
  )

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'OPEN':
        return 'info'
      case 'PARTIAL':
        return 'warning'
      case 'FILLED':
        return 'success'
      case 'CANCELLED':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string): React.ReactElement | undefined => {
    switch (status) {
      case 'FILLED':
        return <CheckCircle fontSize="small" />
      case 'OPEN':
      case 'PARTIAL':
        return <Schedule fontSize="small" />
      default:
        return undefined
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Orders
      </Typography>

      <TableContainer component={Paper} sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Symbol</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Side</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Filled</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Time</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">Loading...</TableCell>
              </TableRow>
            ) : orders?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No orders found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders?.data.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <Chip label={order.symbol} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.side}
                      color={order.side === 'BUY' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    {order.price
                      ? parseFloat(order.price).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : 'Market'}
                  </TableCell>
                  <TableCell>
                    {parseFloat(order.quantity).toLocaleString('en-US', {
                      minimumFractionDigits: 8,
                      maximumFractionDigits: 8,
                    })}
                  </TableCell>
                  <TableCell>
                    {parseFloat(order.filledQuantity).toLocaleString('en-US', {
                      minimumFractionDigits: 8,
                      maximumFractionDigits: 8,
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {format(new Date(order.createdAt), 'HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {(order.status === 'OPEN' || order.status === 'PARTIAL') && (
                      <Tooltip title="Cancel Order">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => cancelMutation.mutate(order.id)}
                          disabled={cancelMutation.isLoading}
                        >
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
