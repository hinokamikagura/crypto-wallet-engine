import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

export interface WalletBalance {
  walletId: number
  currency: 'USDT' | 'BTC' | 'ETH'
  balance: string
}

export interface Order {
  id: number
  userId: number
  type: 'LIMIT' | 'MARKET'
  side: 'BUY' | 'SELL'
  baseCurrency: 'BTC' | 'ETH'
  quoteCurrency: 'USDT'
  symbol: string
  price: string | null
  quantity: string
  filledQuantity: string
  remainingQuantity: string
  status: 'OPEN' | 'PARTIAL' | 'FILLED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

export interface Trade {
  id: number
  orderIdBuy: number
  orderIdSell: number
  price: string
  quantity: string
  baseCurrency: string
  quoteCurrency: string
  symbol: string
  timestamp: string
}

export interface OrderBookLevel {
  price: string
  quantity: string
}

export interface OrderBook {
  symbol: string
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
}

export const userApi = {
  create: (email: string, name: string) =>
    apiClient.post<User>('/users', { email, name }),
  getById: (id: number) => apiClient.get<User>(`/users/${id}`),
}

export const walletApi = {
  deposit: (userId: number, currency: string, amount: string, idempotencyKey?: string) =>
    apiClient.post<WalletBalance>(
      `/wallets/deposit?userId=${userId}&currency=${currency}`,
      { amount, idempotencyKey }
    ),
  getBalances: (userId: number) =>
    apiClient.get<WalletBalance[]>(`/wallets/balances?userId=${userId}`),
  getBalance: (userId: number, currency: string) =>
    apiClient.get<WalletBalance>(`/wallets/balance?userId=${userId}&currency=${currency}`),
}

export const orderApi = {
  place: (userId: number, order: {
    type: 'LIMIT' | 'MARKET'
    side: 'BUY' | 'SELL'
    baseCurrency: 'BTC' | 'ETH'
    quoteCurrency: 'USDT'
    price?: string | null
    quantity: string
    idempotencyKey?: string
  }) => apiClient.post<Order>(`/orders?userId=${userId}`, order),
  cancel: (userId: number, orderId: number) =>
    apiClient.post<Order>(`/orders/${orderId}/cancel?userId=${userId}`),
  getById: (userId: number, orderId: number) =>
    apiClient.get<Order>(`/orders/${orderId}?userId=${userId}`),
  getUserOrders: (userId: number) =>
    apiClient.get<Order[]>(`/orders?userId=${userId}`),
}

export const marketDataApi = {
  getOrderBook: (symbol: string) =>
    apiClient.get<OrderBook>(`/market/orderbook/${symbol}`),
  getTrades: (symbol: string, limit: number = 100) =>
    apiClient.get<Trade[]>(`/market/trades/${symbol}?limit=${limit}`),
}
