const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Kakutausa API Documentation',
    version: '1.0.0',
    description: 'API Documentation for the Kakutausa backend server.',
  },
  servers: [
    {
      url: '/api',
      description: 'API Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'KakutaAdmin' },
          email: { type: 'string', format: 'email', example: 'admin@kakuta.com' },
          role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'USER' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Manual Clamps' },
        },
      },
      Size: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          productId: { type: 'integer', example: 1 },
          holdingCapacityMetric: { type: 'string', example: '100 kg' },
          weightMetric: { type: 'string', example: '0.5 kg' },
          handleMovesMetric: { type: 'string', example: '60°' },
          barMovesMetric: { type: 'string', example: '90°' },
          drawingMovementMetric: { type: 'string', example: '20 mm' },
          holdingCapacityInch: { type: 'string', example: '220 lbs' },
          weightInch: { type: 'string', example: '1.1 lbs' },
          handleMovesInch: { type: 'string', example: '60°' },
          barMovesInch: { type: 'string', example: '90°' },
          drawingMovementInch: { type: 'string', example: '0.78 in' },
        },
      },
      ProductImage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          productId: { type: 'integer', example: 1 },
          imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
        },
      },
      ProductModel: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          productId: { type: 'integer', example: 1 },
          gltfUrl: { type: 'string', format: 'uri', example: 'https://example.com/model.gltf' },
          binUrl: { type: 'string', format: 'uri', example: 'https://example.com/model.bin' },
          stepUrl: { type: 'string', format: 'uri', example: 'https://example.com/model.step' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'KKT-101' },
          details: { type: 'string', example: 'High durability toggle clamp' },
          description: { type: 'string', example: 'Excellent choice for heavy industrial applications.' },
          categoryId: { type: 'integer', example: 1 },
          category: { $ref: '#/components/schemas/Category' },
          sizes: {
            type: 'array',
            items: { $ref: '#/components/schemas/Size' },
          },
          images: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductImage' },
          },
          models: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductModel' },
          },
        },
      },
      AddressType: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Headquarters' },
        },
      },
      Address: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          addressTypeId: { type: 'integer', example: 1 },
          address: { type: 'string', example: '123 Industrial Rd, City, Country' },
          phone1: { type: 'string', example: '+1234567890' },
          phone2: { type: 'string', example: '+9876543210' },
          email: { type: 'string', format: 'email', example: 'info@kakuta.com' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          addressType: { $ref: '#/components/schemas/AddressType' },
        },
      },
      ContentType: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'News' },
        },
      },
      Content: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          contentTypeId: { type: 'integer', example: 1 },
          language: { type: 'string', example: 'en' },
          title: { type: 'string', example: 'Product launch' },
          detail: { type: 'string', example: 'We have launched new manual clamps today.' },
          imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/news.jpg' },
          isPublished: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          contentType: { $ref: '#/components/schemas/ContentType' },
        },
      },
      Request3D: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'client@example.com' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          message: { type: 'string', example: 'Please send us KKT-101 3D step file' },
          productId: { type: 'integer', example: 1 },
          handled: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string', example: 'newUser' },
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'StrongPassword123' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'User registered successfully' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          409: {
            description: 'Username or Email already exists',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['login', 'password'],
                properties: {
                  login: { type: 'string', example: 'KakutaAdmin', description: 'Username or Email' },
                  password: { type: 'string', example: 'SecurePass!2025@Kakuta' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Login successful' },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'KakutaAdmin' },
                        email: { type: 'string', format: 'email', example: 'admin@kakuta.com' },
                        role: { type: 'string', example: 'ADMIN' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user',
        responses: {
          200: {
            description: 'Logout successful',
          },
        },
      },
    },
    '/auth/user-info': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user info',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'User info retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'User info retrieved successfully' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/auth/update-profile': {
      put: {
        tags: ['Auth'],
        summary: 'Update user profile',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'UpdatedName' },
                  email: { type: 'string', format: 'email', example: 'updated@example.com' },
                  password: { type: 'string', example: 'NewStrongPassword123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Profile updated successfully' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories',
        responses: {
          200: {
            description: 'Categories fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Categories fetched successfully' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a new category',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Manual Clamps' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Category created successfully' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid input',
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Category fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Category fetched successfully' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Category not found',
          },
        },
      },
      put: {
        tags: ['Categories'],
        summary: 'Update a category',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Pneumatic Clamps' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Category updated successfully' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Category not found',
          },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete a category',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Category deleted successfully',
          },
          404: {
            description: 'Category not found',
          },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        responses: {
          200: {
            description: 'Products fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Products fetched successfully' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'categoryId'],
                properties: {
                  name: { type: 'string', example: 'KKT-101' },
                  details: { type: 'string', example: 'Detail info about clamp' },
                  description: { type: 'string', example: 'Heavy duty toggle clamp' },
                  categoryId: { type: 'integer', example: 1 },
                  sizes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        holdingCapacityMetric: { type: 'string', example: '100 kg' },
                        weightMetric: { type: 'string', example: '0.5 kg' },
                        handleMovesMetric: { type: 'string', example: '60°' },
                        barMovesMetric: { type: 'string', example: '90°' },
                        drawingMovementMetric: { type: 'string', example: '20 mm' },
                        holdingCapacityInch: { type: 'string', example: '220 lbs' },
                        weightInch: { type: 'string', example: '1.1 lbs' },
                        handleMovesInch: { type: 'string', example: '60°' },
                        barMovesInch: { type: 'string', example: '90°' },
                        drawingMovementInch: { type: 'string', example: '0.78 in' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Product created successfully' },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/products/search': {
      get: {
        tags: ['Products'],
        summary: 'Get products by category name',
        parameters: [
          {
            name: 'category',
            in: 'query',
            required: false,
            schema: { type: 'string', example: 'Manual Clamps' },
            description: 'Name of the category to filter by (or "All")',
          },
        ],
        responses: {
          200: {
            description: 'Products fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Products fetched successfully' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Product fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Product fetched successfully' },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Product not found',
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update a product',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  details: { type: 'string' },
                  description: { type: 'string' },
                  categoryId: { type: 'integer' },
                  updateType: { type: 'string', enum: ['images', 'models'] },
                  files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Product updated successfully' },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product or parts of it',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'deleteType',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['images', 'models'] },
            description: 'Specify if you only want to delete images or models instead of the whole product.',
          },
        ],
        responses: {
          200: {
            description: 'Deleted successfully',
          },
        },
      },
    },
    '/products/{id}/images': {
      get: {
        tags: ['Products'],
        summary: 'Get product images',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Images fetched successfully',
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Upload images to a product',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Images uploaded successfully',
          },
        },
      },
    },
    '/products/{id}/models': {
      get: {
        tags: ['Products'],
        summary: 'Get product 3D models',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Models fetched successfully',
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Upload model files to a product',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  gltf: { type: 'string', format: 'binary' },
                  bin: { type: 'string', format: 'binary' },
                  step: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Model uploaded successfully',
          },
        },
      },
    },
    '/sizes': {
      get: {
        tags: ['Sizes'],
        summary: 'Get all sizes',
        responses: {
          200: {
            description: 'Sizes fetched successfully',
          },
        },
      },
      post: {
        tags: ['Sizes'],
        summary: 'Create a new product size',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: {
                  productId: { type: 'integer', example: 1 },
                  holdingCapacityMetric: { type: 'string' },
                  weightMetric: { type: 'string' },
                  handleMovesMetric: { type: 'string' },
                  barMovesMetric: { type: 'string' },
                  drawingMovementMetric: { type: 'string' },
                  holdingCapacityInch: { type: 'string' },
                  weightInch: { type: 'string' },
                  handleMovesInch: { type: 'string' },
                  barMovesInch: { type: 'string' },
                  drawingMovementInch: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Size created successfully',
          },
        },
      },
    },
    '/sizes/{id}': {
      get: {
        tags: ['Sizes'],
        summary: 'Get size by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Size fetched successfully',
          },
        },
      },
      put: {
        tags: ['Sizes'],
        summary: 'Update a size',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  holdingCapacityMetric: { type: 'string' },
                  weightMetric: { type: 'string' },
                  handleMovesMetric: { type: 'string' },
                  barMovesMetric: { type: 'string' },
                  drawingMovementMetric: { type: 'string' },
                  holdingCapacityInch: { type: 'string' },
                  weightInch: { type: 'string' },
                  handleMovesInch: { type: 'string' },
                  barMovesInch: { type: 'string' },
                  drawingMovementInch: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Size updated successfully',
          },
        },
      },
      delete: {
        tags: ['Sizes'],
        summary: 'Delete a size',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Size deleted successfully',
          },
        },
      },
    },
    '/address-types': {
      get: {
        tags: ['Address Types'],
        summary: 'Get all address types',
        responses: {
          200: {
            description: 'Address types fetched successfully',
          },
        },
      },
      post: {
        tags: ['Address Types'],
        summary: 'Create address type',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Headquarters' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Address type created successfully',
          },
        },
      },
    },
    '/address-types/{id}': {
      get: {
        tags: ['Address Types'],
        summary: 'Get address type by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Fetched successfully',
          },
        },
      },
      put: {
        tags: ['Address Types'],
        summary: 'Update address type',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Warehouse' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated successfully',
          },
        },
      },
      delete: {
        tags: ['Address Types'],
        summary: 'Delete address type',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Deleted successfully',
          },
        },
      },
    },
    '/addresses': {
      get: {
        tags: ['Addresses'],
        summary: 'Get all addresses',
        responses: {
          200: {
            description: 'Addresses fetched successfully',
          },
        },
      },
      post: {
        tags: ['Addresses'],
        summary: 'Create address',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['addressTypeId', 'address'],
                properties: {
                  addressTypeId: { type: 'integer', example: 1 },
                  address: { type: 'string', example: '123 Main St' },
                  phone1: { type: 'string' },
                  phone2: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Address created successfully',
          },
        },
      },
    },
    '/addresses/{id}': {
      get: {
        tags: ['Addresses'],
        summary: 'Get address by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Fetched successfully',
          },
        },
      },
      put: {
        tags: ['Addresses'],
        summary: 'Update address',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  addressTypeId: { type: 'integer' },
                  address: { type: 'string' },
                  phone1: { type: 'string' },
                  phone2: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated successfully',
          },
        },
      },
      delete: {
        tags: ['Addresses'],
        summary: 'Delete address',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Deleted successfully',
          },
        },
      },
    },
    '/content-types': {
      get: {
        tags: ['Content Types'],
        summary: 'Get all content types',
        responses: {
          200: {
            description: 'Content types fetched successfully',
          },
        },
      },
      post: {
        tags: ['Content Types'],
        summary: 'Create content type',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Blog' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Content type created successfully',
          },
        },
      },
    },
    '/content-types/{id}': {
      get: {
        tags: ['Content Types'],
        summary: 'Get content type by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Fetched successfully',
          },
        },
      },
      put: {
        tags: ['Content Types'],
        summary: 'Update content type',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Content Type' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated successfully',
          },
        },
      },
      delete: {
        tags: ['Content Types'],
        summary: 'Delete content type',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Deleted successfully',
          },
        },
      },
    },
    '/contents': {
      get: {
        tags: ['Contents'],
        summary: 'Get all contents',
        responses: {
          200: {
            description: 'Contents fetched successfully',
          },
        },
      },
      post: {
        tags: ['Contents'],
        summary: 'Create content',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['contentTypeId', 'language', 'title'],
                properties: {
                  contentTypeId: { type: 'integer', example: 1 },
                  language: { type: 'string', example: 'en' },
                  title: { type: 'string', example: 'My Content Title' },
                  detail: { type: 'string', example: 'Detailed text' },
                  isPublished: { type: 'boolean', example: true },
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Content created successfully',
          },
        },
      },
    },
    '/contents/search': {
      get: {
        tags: ['Contents'],
        summary: 'Get contents by type and language',
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Content type name',
          },
          {
            name: 'lang',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Language code (e.g. en, jp)',
          },
        ],
        responses: {
          200: {
            description: 'Fetched successfully',
          },
        },
      },
    },
    '/contents/{id}': {
      get: {
        tags: ['Contents'],
        summary: 'Get content by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Fetched successfully',
          },
        },
      },
      put: {
        tags: ['Contents'],
        summary: 'Update content',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  contentTypeId: { type: 'integer' },
                  language: { type: 'string' },
                  title: { type: 'string' },
                  detail: { type: 'string' },
                  isPublished: { type: 'boolean' },
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated successfully',
          },
        },
      },
      delete: {
        tags: ['Contents'],
        summary: 'Delete content',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Deleted successfully',
          },
        },
      },
    },
    '/send-email/request3d': {
      post: {
        tags: ['Send Email'],
        summary: 'Send 3D file request email & save request',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'productId'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'client@example.com' },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                  message: { type: 'string', example: 'Please send us KKT-101 3D model step file' },
                  productId: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Submitted and email sent successfully',
          },
        },
      },
    },
    '/dashboard/stats': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get dashboard statistics',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Dashboard stats retrieved successfully',
          },
        },
      },
    },
    '/requests3d': {
      get: {
        tags: ['Request 3D'],
        summary: 'Get all 3D requests',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Requests retrieved successfully',
          },
        },
      },
    },
    '/requests3d/{id}/status': {
      patch: {
        tags: ['Request 3D'],
        summary: 'Update request status (handled or not)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['handled'],
                properties: {
                  handled: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Request status updated successfully',
          },
        },
      },
    },
    '/requests3d/{id}': {
      delete: {
        tags: ['Request 3D'],
        summary: 'Delete a 3D request',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Request deleted successfully',
          },
        },
      },
    },
  },
};

const serve = swaggerUi.serve;
const setup = swaggerUi.setup(swaggerDocument);

module.exports = {
  serve,
  setup,
};
