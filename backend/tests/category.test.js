const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/utils/constants');

// Mock prisma database client
jest.mock('../src/config/db', () => {
  return {
    category: {
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

describe('Category Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, username: 'admin', role: 'ADMIN' }, JWT_SECRET);
    userToken = jwt.sign({ userId: 2, username: 'user', role: 'USER' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should return a list of categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Manual Clamps' },
        { id: 2, name: 'Pneumatic Clamps' },
      ];
      prisma.category.findMany.mockResolvedValueOnce(mockCategories);

      const res = await request(app).get('/api/categories');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Categories fetched successfully');
      expect(res.body.data).toEqual(mockCategories);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const mockCategory = { id: 1, name: 'Manual Clamps' };
      prisma.category.findUnique.mockResolvedValueOnce(mockCategory);

      const res = await request(app).get('/api/categories/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Category fetched successfully');
      expect(res.body.data).toEqual(mockCategory);
    });

    it('should return 404 if category not found', async () => {
      prisma.category.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).get('/api/categories/999');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Category not found');
    });

    it('should return 400 for invalid category ID', async () => {
      const res = await request(app).get('/api/categories/invalid');

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid category ID');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category when authenticated as admin', async () => {
      const newCategory = { id: 3, name: 'Toggle Clamps' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.category.create.mockResolvedValueOnce(newCategory);

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Toggle Clamps' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Category created successfully');
      expect(res.body.data).toEqual(newCategory);
    });

    it('should return 401 if a user (non-admin) tries to create a category', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 2, role: 'USER' });

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Toggle Clamps' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Unauthorized: Must be admin role only');
    });

    it('should return 400 if name is missing', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Category name is required');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category when authenticated as admin', async () => {
      const updatedCategory = { id: 1, name: 'Heavy Clamps' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.category.findUnique.mockResolvedValueOnce({ id: 1, name: 'Manual Clamps' });
      prisma.category.update.mockResolvedValueOnce(updatedCategory);

      const res = await request(app)
        .put('/api/categories/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Heavy Clamps' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Category updated successfully');
      expect(res.body.data).toEqual(updatedCategory);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category when authenticated as admin', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.category.findUnique.mockResolvedValueOnce({ id: 1, name: 'Manual Clamps' });
      prisma.category.delete.mockResolvedValueOnce({ id: 1 });

      const res = await request(app)
        .delete('/api/categories/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Category deleted successfully');
    });
  });
});
