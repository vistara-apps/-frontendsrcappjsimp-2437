const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

app.use(express.json({ limit: '10mb' }));

// Mock database - In production, use a real database
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    email: 'admin@company.com'
  },
  {
    id: 2,
    username: 'user',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    email: 'user@company.com'
  }
];

// Mock data
const mockKPIs = {
  totalSales: 125000,
  activeCustomers: 1247,
  dailyRevenue: 5430,
  monthlyGrowth: 12.5,
  conversionRate: 2.4,
  avgOrderValue: 156,
  customerRetention: 78
};

const mockSales = [
  { date: '2024-01-01', sales: 12000, orders: 45, customers: 38 },
  { date: '2024-01-02', sales: 15000, orders: 52, customers: 41 },
  { date: '2024-01-03', sales: 13500, orders: 48, customers: 39 },
  { date: '2024-01-04', sales: 18000, orders: 61, customers: 52 },
  { date: '2024-01-05', sales: 16500, orders: 55, customers: 47 },
  { date: '2024-01-06', sales: 21000, orders: 68, customers: 58 },
  { date: '2024-01-07', sales: 19500, orders: 63, customers: 54 }
];

const mockTransactions = [
  { 
    id: 1, 
    customer: 'John Doe', 
    amount: 299, 
    date: '2024-01-07', 
    status: 'completed',
    product: 'Premium Package',
    paymentMethod: 'Credit Card'
  },
  { 
    id: 2, 
    customer: 'Jane Smith', 
    amount: 156, 
    date: '2024-01-07', 
    status: 'completed',
    product: 'Standard Package',
    paymentMethod: 'PayPal'
  },
  { 
    id: 3, 
    customer: 'Bob Johnson', 
    amount: 89, 
    date: '2024-01-06', 
    status: 'pending',
    product: 'Basic Package',
    paymentMethod: 'Credit Card'
  },
  { 
    id: 4, 
    customer: 'Alice Brown', 
    amount: 432, 
    date: '2024-01-06', 
    status: 'completed',
    product: 'Enterprise Package',
    paymentMethod: 'Bank Transfer'
  },
  { 
    id: 5, 
    customer: 'Charlie Wilson', 
    amount: 178, 
    date: '2024-01-05', 
    status: 'completed',
    product: 'Standard Package',
    paymentMethod: 'Credit Card'
  }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Authentication endpoints
app.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
app.get('/kpis', authenticateToken, (req, res) => {
  try {
    // Add some dynamic data based on current date
    const dynamicKPIs = {
      ...mockKPIs,
      dailyRevenue: mockKPIs.dailyRevenue + Math.floor(Math.random() * 1000),
      activeCustomers: mockKPIs.activeCustomers + Math.floor(Math.random() * 50),
      lastUpdated: new Date().toISOString()
    };
    
    res.json(dynamicKPIs);
  } catch (error) {
    console.error('KPIs error:', error);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

app.get('/sales', authenticateToken, (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let salesData = [...mockSales];
    
    // Filter based on period
    if (period === '30d') {
      // Generate more data for 30 days
      const extendedSales = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        extendedSales.push({
          date: date.toISOString().split('T')[0],
          sales: Math.floor(Math.random() * 25000) + 10000,
          orders: Math.floor(Math.random() * 80) + 30,
          customers: Math.floor(Math.random() * 60) + 25
        });
      }
      salesData = extendedSales.reverse();
    }
    
    res.json(salesData);
  } catch (error) {
    console.error('Sales error:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

app.get('/transactions', authenticateToken, (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let filteredTransactions = [...mockTransactions];
    
    // Filter by status
    if (status && status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t => 
        t.customer.toLowerCase().includes(searchLower) ||
        t.product.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    res.json({
      transactions: paginatedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredTransactions.length / limit),
        totalItems: filteredTransactions.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Analytics endpoints
app.get('/analytics/overview', authenticateToken, (req, res) => {
  try {
    const overview = {
      totalRevenue: mockKPIs.totalSales,
      totalOrders: mockSales.reduce((sum, day) => sum + (day.orders || 0), 0),
      averageOrderValue: mockKPIs.avgOrderValue,
      topProducts: [
        { name: 'Premium Package', sales: 45, revenue: 13455 },
        { name: 'Standard Package', sales: 78, revenue: 12168 },
        { name: 'Basic Package', sales: 123, revenue: 10947 },
        { name: 'Enterprise Package', sales: 23, revenue: 9936 }
      ],
      salesByRegion: [
        { region: 'North America', sales: 45000, percentage: 36 },
        { region: 'Europe', sales: 38000, percentage: 30.4 },
        { region: 'Asia Pacific', sales: 28000, percentage: 22.4 },
        { region: 'Other', sales: 14000, percentage: 11.2 }
      ]
    };
    
    res.json(overview);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// User management endpoints (admin only)
app.get('/users', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
