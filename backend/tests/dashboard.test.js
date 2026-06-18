const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/utils/constants');

// Mock prisma database client
jest.mock('../src/config/db', () => {
  return {
    user: {
      count: jest.fn().mockResolvedValue(10),
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn(),
    },
    product: {
      count: jest.fn().mockResolvedValue(20),
    },
    category: {
      count: jest.fn().mockResolvedValue(5),
      findMany: jest.fn().mockResolvedValue([]),
    },
    request3D: {
      count: jest.fn().mockResolvedValue(15),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };
});

// Mock rate limiting to prevent test requests from hitting limits
jest.mock('express-rate-limit', () => {
  return () => (req, res, next) => next();
});

describe('Dashboard Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, username: 'admin', role: 'ADMIN' }, JWT_SECRET);
    userToken = jwt.sign({ userId: 2, username: 'user', role: 'USER' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/dashboard/stats', () => {
    it('should retrieve dashboard stats successfully as admin', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Dashboard stats retrieved successfully');
      expect(res.body.data.totalUsers).toEqual(10);
      expect(res.body.data.totalProducts).toEqual(20);
      expect(res.body.data.totalCategories).toEqual(5);
      expect(res.body.data.total3DRequests).toEqual(15);
    });

    it('should return 401 if user is not admin', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 2, role: 'USER' });

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Unauthorized: Must be admin role only');
    });
  });
});
