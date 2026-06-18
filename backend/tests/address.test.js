const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/utils/constants');

// Mock prisma database client
jest.mock('../src/config/db', () => {
  return {
    addressType: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    address: {
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

describe('Address and AddressType Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, username: 'admin', role: 'ADMIN' }, JWT_SECRET);
    userToken = jwt.sign({ userId: 2, username: 'user', role: 'USER' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AddressType CRUD', () => {
    it('should create address type as admin', async () => {
      const mockType = { id: 1, name: 'Headquarters' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.addressType.create.mockResolvedValueOnce(mockType);

      const res = await request(app)
        .post('/api/address-types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Headquarters' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Address type created successfully');
      expect(res.body.data).toEqual(mockType);
    });

    it('should get all address types', async () => {
      const mockTypes = [{ id: 1, name: 'Headquarters' }];
      prisma.addressType.findMany.mockResolvedValueOnce(mockTypes);

      const res = await request(app).get('/api/address-types');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual(mockTypes);
    });

    it('should get address type by ID', async () => {
      const mockType = { id: 1, name: 'Headquarters' };
      prisma.addressType.findUnique.mockResolvedValueOnce(mockType);

      const res = await request(app).get('/api/address-types/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual(mockType);
    });

    it('should return 404 if address type not found', async () => {
      prisma.addressType.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/address-types/999');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('Address CRUD', () => {
    it('should create address as admin', async () => {
      const mockAddress = {
        id: 1,
        addressTypeId: 1,
        address: '123 Main St',
        phone1: '123456',
        phone2: null,
        email: 'test@example.com',
      };

      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.addressType.findUnique.mockResolvedValueOnce({ id: 1, name: 'Headquarters' });
      prisma.address.create.mockResolvedValueOnce(mockAddress);

      const res = await request(app)
        .post('/api/addresses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          addressTypeId: 1,
          address: '123 Main St',
          phone1: '123456',
          email: 'test@example.com',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Address created successfully');
      expect(res.body.data).toEqual(mockAddress);
    });

    it('should get all addresses', async () => {
      const mockAddresses = [
        {
          id: 1,
          address: '123 Main St',
          addressType: { id: 1, name: 'Headquarters' },
        },
      ];
      prisma.address.findMany.mockResolvedValueOnce(mockAddresses);

      const res = await request(app).get('/api/addresses');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual(mockAddresses);
    });

    it('should update address as admin', async () => {
      const mockAddress = { id: 1, address: '123 Main St' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.address.findUnique.mockResolvedValueOnce(mockAddress);
      prisma.address.update.mockResolvedValueOnce({ id: 1, address: '456 Updated St' });

      const res = await request(app)
        .put('/api/addresses/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ address: '456 Updated St' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Address updated successfully');
    });

    it('should delete address as admin', async () => {
      const mockAddress = { id: 1, address: '123 Main St' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.address.findUnique.mockResolvedValueOnce(mockAddress);
      prisma.address.delete.mockResolvedValueOnce({ id: 1 });

      const res = await request(app)
        .delete('/api/addresses/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Address deleted successfully');
    });
  });
});
