import { Grid, Card, CardContent, Typography, Box } from '@mui/material'
import { TrendingUp, TrendingDown, Assessment } from '@mui/icons-material'

interface QuickStatsProps {
  totalBalance: number
  openOrders: number
  activeSymbol: string
}

export default function QuickStats({ totalBalance, openOrders, activeSymbol }: QuickStatsProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUp sx={{ mr: 1, color: '#00d4ff' }} />
              <Typography variant="body2" color="text.secondary">
                Balance
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ${totalBalance.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Assessment sx={{ mr: 1, color: '#00d4ff' }} />
              <Typography variant="body2" color="text.secondary">
                Orders
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {openOrders}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ background: '#151932', border: '1px solid #2a3a5c' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingDown sx={{ mr: 1, color: '#00d4ff' }} />
              <Typography variant="body2" color="text.secondary">
                Symbol
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {activeSymbol}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
