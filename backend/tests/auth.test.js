const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/utils/constants');

// Mock prisma database client
jest.mock('../src/config/db', () => {
  return {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
  };
});

// Mock rate limiting to prevent test requests from hitting limits
jest.mock('express-rate-limit', () => {
  return () => (req, res, next) => next();
});

describe('Auth Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null); // username check
      prisma.user.findUnique.mockResolvedValueOnce(null); // email check
      prisma.user.create.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'USER',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('User registered successfully');
      expect(res.body.data.username).toEqual('testuser');
      expect(res.body.data.password).toBeUndefined();
    });

    it('should return 409 if username exists', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1, username: 'testuser' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toEqual('Username already exists');
    });

    it('should return 409 if email exists', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toEqual('Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      const { hashPassword } = require('../src/utils/hashPassword');
      const hashedPassword = await hashPassword('password123');

      prisma.user.findFirst.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          login: 'testuser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Login successful');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.username).toEqual('testuser');
    });

    it('should return 400 for invalid login credentials', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          login: 'wronguser',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid username or email');
    });
  });

  describe('GET /api/auth/user-info', () => {
    it('should return user info when authenticated', async () => {
      const token = jwt.sign({ userId: 1, username: 'testuser', role: 'USER' }, JWT_SECRET);
      prisma.user.findFirst.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
      });

      const res = await request(app)
        .get('/api/auth/user-info')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('User info retrieved successfully');
      expect(res.body.data.username).toEqual('testuser');
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/auth/user-info');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/user-info')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toEqual(401);
    });
  });
});
