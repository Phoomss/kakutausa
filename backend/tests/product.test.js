const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/utils/constants');

// Mock prisma database client
jest.mock('../src/config/db', () => {
  return {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
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

// Mock supabase storage utility to prevent upload attempts
jest.mock('../src/utils/supabaseStorage', () => {
  return {
    upload: {
      any: () => (req, res, next) => next(),
      array: () => (req, res, next) => next(),
      fields: () => (req, res, next) => next(),
      single: () => (req, res, next) => next(),
      none: () => (req, res, next) => next(),
    },
    deleteFileFromSupabase: jest.fn(),
    uploadModelFiles: jest.fn(),
    uploadFileToSupabase: jest.fn(),
  };
});

describe('Product Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, username: 'admin', role: 'ADMIN' }, JWT_SECRET);
    userToken = jwt.sign({ userId: 2, username: 'user', role: 'USER' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product A', categoryId: 1, images: [], sizes: [], models: [] },
        { id: 2, name: 'Product B', categoryId: 1, images: [], sizes: [], models: [] },
      ];
      prisma.product.findMany.mockResolvedValueOnce(mockProducts);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Products fetched successfully');
      expect(res.body.data).toEqual(mockProducts);
    });

    it('should support pagination', async () => {
      const mockProducts = [
        { id: 1, name: 'Product A', categoryId: 1, images: [], sizes: [], models: [] },
      ];
      prisma.product.count.mockResolvedValueOnce(10);
      prisma.product.findMany.mockResolvedValueOnce(mockProducts);

      const res = await request(app).get('/api/products?page=1&limit=1');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Products fetched successfully');
      expect(res.body.data).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 1,
        })
      );
    });
  });

  describe('GET /api/products/search', () => {
    it('should filter products by category query parameter', async () => {
      const mockProducts = [
        { id: 1, name: 'Product A', categoryId: 1, images: [], category: { name: 'Manual Clamps' } },
      ];
      prisma.product.findMany.mockResolvedValueOnce(mockProducts);

      const res = await request(app).get('/api/products/search?category=Manual%20Clamps');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Products fetched successfully');
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            category: { name: 'Manual Clamps' },
          },
        })
      );
    });
  });

  describe('POST /api/products', () => {
    it('should create a product when user is admin', async () => {
      const newProduct = {
        id: 1,
        name: 'New Clamp',
        description: 'Excellent clamp',
        categoryId: 1,
        sizes: [],
        images: [],
        models: [],
      };

      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.category.findUnique.mockResolvedValueOnce({ id: 1, name: 'Manual Clamps' });
      prisma.product.create.mockResolvedValueOnce(newProduct);

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Clamp',
          description: 'Excellent clamp',
          categoryId: 1,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Product created successfully');
      expect(res.body.data).toEqual(newProduct);
    });

    it('should return 401 if user is not admin', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 2, role: 'USER' });

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Clamp',
          description: 'Excellent clamp',
          categoryId: 1,
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Unauthorized: Must be admin role only');
    });

    it('should return 400 if categoryId is invalid', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Clamp',
          description: 'Excellent clamp',
          categoryId: 'invalid',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid categoryId');
    });

    it('should return 404 if category does not exist', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.category.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Clamp',
          description: 'Excellent clamp',
          categoryId: 999,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Category not found');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by ID', async () => {
      const mockProduct = {
        id: 1,
        name: 'Clamp A',
        categoryId: 1,
        sizes: [],
        images: [],
        models: [],
      };
      prisma.product.findUnique.mockResolvedValueOnce(mockProduct);

      const res = await request(app).get('/api/products/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Product fetched successfully');
      expect(res.body.data).toEqual(mockProduct);
    });

    it('should return 404 if product is not found', async () => {
      prisma.product.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).get('/api/products/999');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Product not found');
    });
  });
});
