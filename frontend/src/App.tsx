import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box, Container, AppBar, Toolbar, Typography, Button, Chip } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'
import Dashboard from './pages/Dashboard'
import Wallet from './pages/Wallet'
import Trading from './pages/Trading'
import Orders from './pages/Orders'
import Navigation from './components/Navigation'
import { useWebSocket } from './hooks/useWebSocket'
import './App.css'

function App() {
  const [userId, setUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem('userId')
    return saved ? parseInt(saved) : null
  })
  const { connected } = useWebSocket()

  const handleLogin = async () => {
    // For demo purposes, create a user automatically
    try {
      const response = await fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user${Date.now()}@example.com`,
          name: 'Demo User'
        })
      })
      const user = await response.json()
      setUserId(user.id)
      localStorage.setItem('userId', user.id.toString())
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  if (!userId) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1e37 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Crypto Trading Engine
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Production-grade trading simulator dashboard
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Trading
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ background: '#151932', borderBottom: '1px solid #2a3a5c' }}>
          <Toolbar>
            <TrendingUp sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Crypto Trading Engine
            </Typography>
            <Chip
              label={connected ? 'Connected' : 'Disconnected'}
              color={connected ? 'success' : 'error'}
              size="small"
              sx={{ mr: 2 }}
            />
            <Typography variant="body2" sx={{ mr: 2 }}>
              User ID: {userId}
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                setUserId(null)
                localStorage.removeItem('userId')
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ flex: 1, py: 3, pb: 10 }}>
          <Routes>
            <Route path="/" element={<Dashboard userId={userId} />} />
            <Route path="/wallet" element={<Wallet userId={userId} />} />
            <Route path="/trading" element={<Trading userId={userId} />} />
            <Route path="/orders" element={<Orders userId={userId} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
        <Navigation />
      </Box>
    </Router>
  )
}

export default App
