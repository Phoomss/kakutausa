const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/utils/constants');

// Mock prisma database client
jest.mock('../src/config/db', () => {
  return {
    contentType: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    content: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
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
    uploadFileToSupabase: jest.fn().mockResolvedValue({ url: 'http://example.com/mock.jpg' }),
  };
});

describe('Content and ContentType Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, username: 'admin', role: 'ADMIN' }, JWT_SECRET);
    userToken = jwt.sign({ userId: 2, username: 'user', role: 'USER' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ContentType CRUD', () => {
    it('should create content type as admin', async () => {
      const mockContentType = { id: 1, name: 'News' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.contentType.create.mockResolvedValueOnce(mockContentType);

      const res = await request(app)
        .post('/api/content-types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'News' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Content type created successfully');
      expect(res.body.data).toEqual(mockContentType);
    });

    it('should get all content types', async () => {
      const mockTypes = [{ id: 1, name: 'News' }];
      prisma.contentType.findMany.mockResolvedValueOnce(mockTypes);

      const res = await request(app).get('/api/content-types');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual(mockTypes);
    });
  });

  describe('Content CRUD', () => {
    it('should create content as admin', async () => {
      const mockContent = {
        id: 1,
        contentTypeId: 1,
        language: 'en',
        title: 'New Product Release',
        detail: 'Description of the release',
        imageUrl: 'http://example.com/mock.jpg',
        isPublished: true,
      };

      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.contentType.findUnique.mockResolvedValueOnce({ id: 1, name: 'News' });
      prisma.content.create.mockResolvedValueOnce(mockContent);

      const res = await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          contentTypeId: 1,
          language: 'en',
          title: 'New Product Release',
          detail: 'Description of the release',
          isPublished: true,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Content created successfully');
      expect(res.body.data).toEqual(mockContent);
    });

    it('should get all contents', async () => {
      const mockContents = [{ id: 1, title: 'Release' }];
      prisma.content.findMany.mockResolvedValueOnce(mockContents);

      const res = await request(app).get('/api/contents');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual(mockContents);
    });

    it('should get contents by type name (search)', async () => {
      const mockContents = [{ id: 1, title: 'Release', contentType: { name: 'News' } }];
      prisma.content.findMany.mockResolvedValueOnce(mockContents);

      const res = await request(app).get('/api/contents/search?contentType=News');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual(mockContents);
      expect(prisma.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            contentType: { name: { equals: 'News' } },
          },
        })
      );
    });

    it('should update content as admin', async () => {
      const mockContent = { id: 1, title: 'Release', imageUrl: 'http://img.com' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.content.findUnique.mockResolvedValueOnce(mockContent);
      prisma.content.update.mockResolvedValueOnce({ id: 1, title: 'Updated Release' });

      const res = await request(app)
        .put('/api/contents/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Release' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Content updated successfully');
    });

    it('should delete content as admin', async () => {
      const mockContent = { id: 1, title: 'Release', imageUrl: 'http://img.com' };
      prisma.user.findFirst.mockResolvedValueOnce({ id: 1, role: 'ADMIN' });
      prisma.content.findUnique.mockResolvedValueOnce(mockContent);
      prisma.content.delete.mockResolvedValueOnce({ id: 1 });

      const res = await request(app)
        .delete('/api/contents/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Content deleted successfully');
    });
  });
});
