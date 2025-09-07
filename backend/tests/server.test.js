const request = require('supertest');
const app = require('../server');

describe('Dashboard API', () => {
  let authToken;

  // Test authentication
  describe('Authentication', () => {
    test('POST /login - should authenticate with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'admin',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('username', 'admin');
      expect(response.body).toHaveProperty('role', 'admin');
      
      authToken = response.body.token;
    });

    test('POST /login - should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'invalid',
          password: 'invalid'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('POST /login - should require username and password', async () => {
      const response = await request(app)
        .post('/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test health check
  describe('Health Check', () => {
    test('GET /health - should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  // Test protected routes
  describe('Protected Routes', () => {
    test('GET /kpis - should require authentication', async () => {
      const response = await request(app).get('/kpis');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('GET /kpis - should return KPIs with valid token', async () => {
      const response = await request(app)
        .get('/kpis')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalSales');
      expect(response.body).toHaveProperty('activeCustomers');
      expect(response.body).toHaveProperty('dailyRevenue');
    });

    test('GET /sales - should return sales data', async () => {
      const response = await request(app)
        .get('/sales')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('date');
      expect(response.body[0]).toHaveProperty('sales');
    });

    test('GET /sales - should support period filtering', async () => {
      const response = await request(app)
        .get('/sales?period=30d')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(30);
    });

    test('GET /transactions - should return paginated transactions', async () => {
      const response = await request(app)
        .get('/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.transactions)).toBe(true);
    });

    test('GET /transactions - should support filtering by status', async () => {
      const response = await request(app)
        .get('/transactions?status=completed')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.transactions.every(t => t.status === 'completed')).toBe(true);
    });

    test('GET /transactions - should support search', async () => {
      const response = await request(app)
        .get('/transactions?search=John')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.transactions.some(t => 
        t.customer.toLowerCase().includes('john')
      )).toBe(true);
    });

    test('GET /analytics/overview - should return analytics data', async () => {
      const response = await request(app)
        .get('/analytics/overview')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalRevenue');
      expect(response.body).toHaveProperty('totalOrders');
      expect(response.body).toHaveProperty('topProducts');
      expect(response.body).toHaveProperty('salesByRegion');
    });
  });

  // Test admin-only routes
  describe('Admin Routes', () => {
    test('GET /users - should require admin role', async () => {
      // First login as regular user
      const userLogin = await request(app)
        .post('/login')
        .send({
          username: 'user',
          password: 'password'
        });

      const userToken = userLogin.body.token;

      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    test('GET /users - should return users for admin', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('username');
      expect(response.body[0]).not.toHaveProperty('password');
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should return 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/non-existent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle invalid JWT tokens', async () => {
      const response = await request(app)
        .get('/kpis')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test rate limiting (this might be flaky in CI)
  describe('Rate Limiting', () => {
    test('should apply rate limiting to auth endpoints', async () => {
      // Make multiple rapid requests to exceed rate limit
      const requests = Array(6).fill().map(() =>
        request(app)
          .post('/login')
          .send({
            username: 'invalid',
            password: 'invalid'
          })
      );

      const responses = await Promise.all(requests);
      
      // At least one should be rate limited
      expect(responses.some(r => r.status === 429)).toBe(true);
    }, 10000); // Increase timeout for this test
  });
});
