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
    request3D: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
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

// Mock nodemailer
jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockImplementation((options) => {
        if (options.to === 'error@example.com') {
          return Promise.reject(new Error('Nodemailer error'));
        }
        return Promise.resolve({ messageId: 'mock-message-id' });
      }),
    }),
  };
});

describe('3D Request Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, username: 'admin', role: 'ADMIN' }, JWT_SECRET);
    userToken = jwt.sign({ userId: 2, username: 'user', role: 'USER' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/send-email/request3d', () => {
    it('should submit a 3D request and send emails', async () => {
      const mockProduct = { id: 1, name: 'Product A', category: { name: 'Category A' } };
      const mockRequest = { id: 10, email: 'client@example.com', createdAt: new Date() };

      prisma.product.findUnique.mockResolvedValueOnce(mockProduct);
      prisma.request3D.create.mockResolvedValueOnce(mockRequest);

      const res = await request(app)
        .post('/api/send-email/request3d')
        .send({
          email: 'client@example.com',
          firstName: 'John',
          lastName: 'Doe',
          message: 'Hello, send me files',
          productId: 1,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('3D request submitted and email sent successfully');
      expect(res.body.data.requestId).toEqual(10);
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/send-email/request3d')
        .send({
          productId: 1,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Email is required');
    });

    it('should return 404 if product not found', async () => {
      prisma.product.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/send-email/request3d')
        .send({
          email: 'client@example.com',
          productId: 999,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Product not found');
    });
  });

  describe('Admin Request3D Management', () => {
    it('should get all requests as admin', async () => {
      const mockRequests = [
        {
          id: 1,
          email: 'client@example.com',
          product: { name: 'Product A' },
          handled: false,
          createdAt: new Date(),
        },
      ];

      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.request3D.findMany.mockResolvedValueOnce(mockRequests);

      const res = await request(app)
        .get('/api/requests3d')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('3D requests retrieved successfully');
      expect(res.body.data[0].email).toEqual('client@example.com');
    });

    it('should update request status as admin', async () => {
      const mockUpdated = {
        id: 1,
        email: 'client@example.com',
        product: { name: 'Product A' },
        handled: true,
        createdAt: new Date(),
      };

      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.request3D.update.mockResolvedValueOnce(mockUpdated);

      const res = await request(app)
        .patch('/api/requests3d/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ handled: true });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Request status updated successfully');
      expect(res.body.data.handled).toEqual(true);
    });

    it('should delete a request as admin', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.request3D.delete.mockResolvedValueOnce({ id: 1 });

      const res = await request(app)
        .delete('/api/requests3d/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Request deleted successfully');
    });
  });
});
