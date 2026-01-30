import { useEffect, useState, useRef } from 'react'

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // For now, simulate WebSocket connection
    // In production, you'd connect to a WebSocket server
    const simulateConnection = () => {
      setConnected(true)
      
      // Simulate receiving messages
      const interval = setInterval(() => {
        // This would be replaced with actual WebSocket messages
        // For now, just keep connection status
      }, 5000)

      return () => {
        clearInterval(interval)
        setConnected(false)
      }
    }

    const cleanup = simulateConnection()
    return cleanup
  }, [])

  return {
    connected,
    sendMessage: (message: any) => {
      // Send message via WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message))
      }
    },
  }
}
