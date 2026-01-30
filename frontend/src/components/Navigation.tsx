import { Link, useLocation } from 'react-router-dom'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { Dashboard, AccountBalance, TrendingUp, List } from '@mui/icons-material'

export default function Navigation() {
  const location = useLocation()

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #2a3a5c',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={location.pathname}
        showLabels
        sx={{ background: '#151932' }}
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<Dashboard />}
          value="/"
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Wallet"
          icon={<AccountBalance />}
          value="/wallet"
          component={Link}
          to="/wallet"
        />
        <BottomNavigationAction
          label="Trading"
          icon={<TrendingUp />}
          value="/trading"
          component={Link}
          to="/trading"
        />
        <BottomNavigationAction
          label="Orders"
          icon={<List />}
          value="/orders"
          component={Link}
          to="/orders"
        />
      </BottomNavigation>
    </Paper>
  )
}
