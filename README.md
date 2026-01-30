# Cryptocurrency Wallet & Trading Engine Simulator

> 🚀 **Full-stack Java 21 + Spring Boot + React dashboard** simulating wallet, order book, and real-time updates via Kafka. Load-tested with Gatling.

A production-grade cryptocurrency wallet and trading engine simulator with **complete React frontend dashboard**. This is a **simulation system** (NOT connected to real blockchain or exchanges) designed to demonstrate enterprise-level full-stack engineering skills.

> 📚 **[View Full Documentation](./docs/README.md)** | 📄 **[Professional Profile](./PROFILE.md)** | 🎨 **[Frontend Guide](./SETUP-FRONTEND.md)**

- **Atomic balance updates** with optimistic locking
- **Event-driven architecture** via Apache Kafka
- **Thread-safe order matching engine** with price-time priority
- **React dashboard** with real-time order book, wallet management, and trading interface
- **Basic risk management** (balance checks, exposure limits)
- **Dockerized infrastructure** (PostgreSQL + Kafka + App + Frontend)
- **Load testing** with Gatling

## Tech Stack

### Backend
- **Java 21** with modern language features (records, pattern matching)
- **Spring Boot 3.3.5** (latest stable)
- **Spring Data JPA** + **PostgreSQL 16**
- **Apache Kafka** (Confluent Platform 7.6.0) for event-driven updates
- **Spring Kafka** for producer/consumer integration
- **Lombok** for reducing boilerplate
- **MapStruct** for DTO mapping
- **JUnit 5** + **Testcontainers** for integration tests
- **Gatling** for load/performance testing

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for modern UI components
- **React Query** for data fetching and caching
- **Axios** for API calls

### Infrastructure
- **Docker Compose** for local development
- **PostgreSQL** for persistence
- **Kafka** for event streaming

## Architecture

### Domain Model

- **User**: Traders in the system
- **Wallet**: User balances per currency (USDT, BTC, ETH) with optimistic locking
- **Order**: Trading orders (LIMIT/MARKET, BUY/SELL) with idempotency support
- **Trade**: Executed trades between orders

### Key Components

1. **Matching Engine**: Thread-safe in-memory order book with price-time priority matching
2. **Risk Engine**: Pre-trade validation (balance checks, exposure limits)
3. **Event System**: Kafka-based event publishing (OrderPlaced, OrderMatched, TradeExecuted, BalanceUpdated)
4. **REST APIs**: Versioned endpoints (`/api/v1/...`)

## Quick Start

### Prerequisites

- Java 21+
- Maven 3.9+
- Docker & Docker Compose
- Node.js 18+ (for frontend)

### Running Locally

1. **Start infrastructure** (PostgreSQL + Kafka):
   ```bash
   docker-compose up -d postgres zookeeper kafka
   ```

2. **Wait for services to be healthy** (check logs):
   ```bash
   docker-compose logs -f
   ```

3. **Build and run the backend**:
   ```bash
   mvn clean package
   mvn spring-boot:run
   ```

   Or run via Docker:
   ```bash
   docker-compose up --build app
   ```

4. **Start the React frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the dashboard**:
   - **Frontend Dashboard**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Health Check**: http://localhost:8080/actuator/health
   - **API Docs**: http://localhost:8080/api/v1 (see [API Documentation](./docs/api.md))

### Quick Demo

1. Open http://localhost:3000
2. Click **"Start Trading"** to create a demo user
3. Navigate to **Wallet** and deposit funds (e.g., 10,000 USDT)
4. Go to **Trading** and place a LIMIT order (e.g., BUY 0.1 BTC at 50,000 USDT)
5. View your orders in the **Orders** page
6. Watch the **Dashboard** for real-time order book updates

### API Endpoints

#### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get user

#### Wallets
- `POST /api/v1/wallets/deposit?userId={id}&currency={currency}` - Deposit funds
- `GET /api/v1/wallets/balances?userId={id}` - Get all balances
- `GET /api/v1/wallets/balance?userId={id}&currency={currency}` - Get specific balance

#### Orders
- `POST /api/v1/orders?userId={id}` - Place order
- `POST /api/v1/orders/{orderId}/cancel?userId={id}` - Cancel order
- `GET /api/v1/orders/{orderId}?userId={id}` - Get order
- `GET /api/v1/orders?userId={id}` - Get user's orders

#### Market Data
- `GET /api/v1/market/orderbook/{symbol}` - Get order book (e.g., BTC/USDT)
- `GET /api/v1/market/trades/{symbol}?limit=100` - Get recent trades

### Example Usage

1. **Create a user**:
   ```bash
   curl -X POST http://localhost:8080/api/v1/users \
     -H "Content-Type: application/json" \
     -d '{"email": "trader@example.com", "name": "John Doe"}'
   ```

2. **Deposit USDT**:
   ```bash
   curl -X POST "http://localhost:8080/api/v1/wallets/deposit?userId=1&currency=USDT" \
     -H "Content-Type: application/json" \
     -d '{"amount": 10000}'
   ```

3. **Place a limit BUY order**:
   ```bash
   curl -X POST "http://localhost:8080/api/v1/orders?userId=1" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "LIMIT",
       "side": "BUY",
       "baseCurrency": "BTC",
       "quoteCurrency": "USDT",
       "price": 50000,
       "quantity": 0.1
     }'
   ```

4. **Check order book**:
   ```bash
   curl http://localhost:8080/api/v1/market/orderbook/BTC/USDT
   ```

## Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests (with Testcontainers)
```bash
# Integration tests require Docker
# They are excluded by default from 'mvn test'
mvn verify  # Runs integration tests in integration-test phase
```

**Note:** Integration tests are excluded by default. Run `mvn test` to execute unit tests only (no Docker required).

### Load Testing with Gatling

1. **Start the application** (as above)

2. **Run Gatling simulation**:
   ```bash
   mvn gatling:test
   ```

   Or run a specific simulation:
   ```bash
   mvn gatling:test -Dgatling.simulationClass=OrderPlacementSimulation
   ```

3. **View results** in `target/gatling/`

## Project Structure

```
crypto-wallet-engine/
├── src/                           # Backend (Spring Boot)
│   ├── main/java/com/example/cryptoengine/
│   │   ├── application/          # Use cases, DTOs, mappers
│   │   ├── controller/            # REST controllers
│   │   ├── domain/                # Domain entities, events, value objects
│   │   ├── infrastructure/        # Repositories, Kafka producers/consumers
│   │   ├── matching/              # Order book & matching engine
│   │   ├── risk/                  # Risk engine & price feed
│   │   └── service/               # Business logic services
│   └── resources/
│       └── application.properties  # Configuration
├── frontend/                      # React Dashboard
│   ├── src/
│   │   ├── api/                   # API client & types
│   │   ├── components/           # Reusable components
│   │   ├── pages/                 # Page components
│   │   └── hooks/                 # Custom hooks
│   ├── package.json
│   └── vite.config.ts
├── src/test/                      # Tests
│   ├── java/                      # Unit & integration tests (65+ tests)
│   └── gatling/                   # Gatling load test scenarios
├── docs/                          # Documentation
├── docker-compose.yml             # Infrastructure setup
└── pom.xml                        # Maven configuration
```

## Key Features

### Backend Features
- ✅ **Atomic Balance Updates**: JPA optimistic locking (`@Version`) prevents concurrent modification
- ✅ **Event-Driven Architecture**: Kafka-based event streaming for real-time state propagation
- ✅ **Thread-Safe Matching Engine**: In-memory order book with `ConcurrentSkipListMap` and read-write locks
- ✅ **Risk Management**: Pre-trade validation, balance checks, and exposure limits
- ✅ **Idempotency**: Support for idempotency keys to prevent duplicate operations
- ✅ **RESTful APIs**: Versioned endpoints with comprehensive error handling
- ✅ **Comprehensive Testing**: 65+ unit tests with Testcontainers integration tests

### Frontend Features
- ✅ **Real-time Dashboard**: Live order book, recent trades, and wallet balances
- ✅ **Trading Interface**: Place LIMIT and MARKET orders with intuitive UI
- ✅ **Wallet Management**: View balances and deposit funds (USDT, BTC, ETH)
- ✅ **Order Management**: View, filter, and cancel orders with status tracking
- ✅ **Auto-refresh**: Real-time updates via polling (WebSocket ready)
- ✅ **Modern UI**: Material-UI components with dark theme
- ✅ **Responsive Design**: Mobile-friendly with bottom navigation

## Configuration

Key configuration in `application.properties`:

- `crypto.risk.max-exposure-usdt`: Maximum exposure limit (default: 100,000 USDT)
- `crypto.risk.enabled`: Enable/disable risk checks (default: true)
- `crypto.trading.pairs`: Supported trading pairs (default: BTC/USDT, ETH/USDT)

## Docker Compose Services

- **postgres**: PostgreSQL 16 database
- **zookeeper**: Kafka Zookeeper
- **kafka**: Kafka broker
- **app**: Spring Boot application

## Performance Considerations

- Order book is in-memory for low latency
- Database uses connection pooling (HikariCP)
- Kafka producers use idempotent configuration
- Optimistic locking reduces lock contention vs pessimistic locking

## Limitations & Future Enhancements

### Current Limitations
- In-memory order book (not distributed)
- Basic risk checks (not production-grade)
- Frontend uses polling instead of WebSocket (WebSocket hook ready for integration)
- No authentication/authorization (demo mode)
- No real blockchain integration

### Future Enhancements
- WebSocket support for real-time order book updates (hook already implemented)
- Distributed order book (Redis/Kafka Streams)
- More sophisticated risk engine
- Order history analytics and charts
- JWT authentication
- Rate limiting
- Multi-user support with proper session management

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Quick Start Guide](./docs/quick-start.md)** - Get up and running in minutes
- **[Architecture Overview](./docs/architecture.md)** - System design and component interactions
- **[API Documentation](./docs/api.md)** - Complete REST API reference with examples
- **[Frontend Documentation](./docs/frontend.md)** - React dashboard features and development guide
- **[Setup Guide](./docs/setup.md)** - Installation and configuration instructions
- **[Design Decisions](./docs/design-decisions.md)** - Key architectural choices and rationale
- **[Testing Guide](./docs/testing.md)** - Testing strategy and load testing
- **[Performance & Scalability](./docs/performance.md)** - Performance characteristics and optimization
- **[Kafka Events](./docs/kafka-events.md)** - Event-driven architecture documentation
- **[Risk Engine](./docs/risk-engine.md)** - Risk management system documentation

**Frontend Setup**: See [SETUP-FRONTEND.md](./SETUP-FRONTEND.md) for detailed frontend setup instructions.

## 👤 Professional Profile

This project demonstrates production-grade **full-stack engineering skills**. See **[PROFILE.md](./PROFILE.md)** for a detailed professional profile highlighting:
- Technical achievements and challenges solved
- Architecture and design patterns (backend + frontend)
- Performance metrics and scalability considerations
- Production-ready features and best practices
- Modern React dashboard with real-time updates

## License

This is a demonstration project for portfolio/resume purposes.

## Author

Built to demonstrate production-grade backend engineering skills with Spring Boot, Kafka, and event-driven architecture.
