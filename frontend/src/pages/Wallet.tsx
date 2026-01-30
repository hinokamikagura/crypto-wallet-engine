import { useState } from 'react'
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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  Chip,
} from '@mui/material'
import { AccountBalance, Add } from '@mui/icons-material'
import { walletApi } from '../api/client'

interface WalletProps {
  userId: number
}

export default function Wallet({ userId }: WalletProps) {
  const [depositOpen, setDepositOpen] = useState(false)
  const [depositCurrency, setDepositCurrency] = useState<'USDT' | 'BTC' | 'ETH'>('USDT')
  const [depositAmount, setDepositAmount] = useState('')
  const queryClient = useQueryClient()

  const { data: balances, isLoading } = useQuery(
    ['balances', userId],
    () => walletApi.getBalances(userId),
    { refetchInterval: 5000 }
  )

  const depositMutation = useMutation(
    (data: { currency: string; amount: string }) =>
      walletApi.deposit(userId, data.currency, data.amount),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['balances', userId])
        setDepositOpen(false)
        setDepositAmount('')
      },
    }
  )

  const handleDeposit = () => {
    if (parseFloat(depositAmount) > 0) {
      depositMutation.mutate({
        currency: depositCurrency,
        amount: depositAmount,
      })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Wallet
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDepositOpen(true)}
        >
          Deposit
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Currency</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Balance</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Value (USDT)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Loading...</TableCell>
              </TableRow>
            ) : balances?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Box sx={{ py: 4 }}>
                    <AccountBalance sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="text.secondary">No wallets found</Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => setDepositOpen(true)}
                    >
                      Make your first deposit
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              balances?.data.map((wallet) => {
                const balance = parseFloat(wallet.balance)
                const usdtValue = wallet.currency === 'USDT'
                  ? balance
                  : wallet.currency === 'BTC'
                  ? balance * 50000
                  : balance * 3000

                return (
                  <TableRow key={wallet.walletId} hover>
                    <TableCell>
                      <Chip
                        label={wallet.currency}
                        color={wallet.currency === 'USDT' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {parseFloat(wallet.balance).toLocaleString('en-US', {
                          minimumFractionDigits: wallet.currency === 'USDT' ? 2 : 8,
                          maximumFractionDigits: wallet.currency === 'USDT' ? 2 : 8,
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        ${usdtValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={depositOpen} onClose={() => setDepositOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deposit Funds</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Currency"
              value={depositCurrency}
              onChange={(e) => setDepositCurrency(e.target.value as 'USDT' | 'BTC' | 'ETH')}
              sx={{ mb: 2 }}
            >
              <MenuItem value="USDT">USDT</MenuItem>
              <MenuItem value="BTC">BTC</MenuItem>
              <MenuItem value="ETH">ETH</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              inputProps={{ min: 0, step: '0.00000001' }}
            />
            {depositMutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Failed to deposit funds
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepositOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDeposit}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
          >
            Deposit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
