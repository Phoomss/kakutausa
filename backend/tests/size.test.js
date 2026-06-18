const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/utils/constants');

// Mock prisma database client
jest.mock('../src/config/db', () => {
  return {
    product: {
      findUnique: jest.fn(),
    },
    size: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
    },
  };
});

// Mock rate limiting to prevent test requests from hitting limits
jest.mock('express-rate-limit', () => {
  return () => (req, res, next) => next();
});

describe('Size Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, username: 'admin', role: 'ADMIN' }, JWT_SECRET);
    userToken = jwt.sign({ userId: 2, username: 'user', role: 'USER' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/sizes', () => {
    it('should retrieve all sizes', async () => {
      const mockSizes = [{ id: 1, productId: 2, holdingCapacityMetric: '100kg' }];
      prisma.size.findMany.mockResolvedValueOnce(mockSizes);

      const res = await request(app).get('/api/sizes');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Sizes fetched successfully');
      expect(res.body.data).toEqual(mockSizes);
    });
  });

  describe('GET /api/sizes/:id', () => {
    it('should retrieve size by ID', async () => {
      const mockSize = { id: 1, productId: 2, holdingCapacityMetric: '100kg' };
      prisma.size.findUnique.mockResolvedValueOnce(mockSize);

      const res = await request(app).get('/api/sizes/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Size fetched successfully');
      expect(res.body.data).toEqual(mockSize);
    });

    it('should return 404 if size not found', async () => {
      prisma.size.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/sizes/999');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/sizes', () => {
    it('should create size as admin', async () => {
      const mockSize = { id: 1, productId: 2, holdingCapacityMetric: '100kg' };

      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.product.findUnique.mockResolvedValueOnce({ id: 2, name: 'Product 2' });
      prisma.size.create.mockResolvedValueOnce(mockSize);

      const res = await request(app)
        .post('/api/sizes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productId: 2,
          holdingCapacityMetric: '100kg',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Size created successfully');
      expect(res.body.data).toEqual(mockSize);
    });

    it('should return 400 for invalid product ID', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });

      const res = await request(app)
        .post('/api/sizes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productId: 'invalid',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid product ID');
    });

    it('should return 404 if product not found', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.product.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/sizes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productId: 999,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Product not found');
    });
  });

  describe('PUT /api/sizes/:id', () => {
    it('should update size as admin', async () => {
      const mockSize = { id: 1, productId: 2 };

      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.size.findUnique.mockResolvedValueOnce(mockSize);
      prisma.size.update.mockResolvedValueOnce({ id: 1, productId: 2, holdingCapacityMetric: '200kg' });

      const res = await request(app)
        .put('/api/sizes/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          holdingCapacityMetric: '200kg',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Size updated successfully');
    });
  });

  describe('DELETE /api/sizes/:id', () => {
    it('should delete size as admin', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.size.findUnique.mockResolvedValueOnce({ id: 1 });
      prisma.size.delete.mockResolvedValueOnce({ id: 1 });

      const res = await request(app)
        .delete('/api/sizes/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Size deleted successfully');
    });
  });
});
