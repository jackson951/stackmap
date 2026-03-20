const fileContentSchema = {
  type: 'object',
  required: ['path', 'name', 'content'],
  properties: {
    path: { type: 'string', description: 'Repository-relative path of the file.' },
    name: { type: 'string', description: 'Filename.' },
    extension: { type: 'string', nullable: true, description: 'File extension (if detectable).' },
    size: { type: 'integer', format: 'int64', nullable: true, description: 'Size of the file in bytes.' },
    summary: { type: 'string', nullable: true, description: 'AI-generated summary of the file content.' },
    content: { type: 'string', description: 'Plain text content of the file.' },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'StackMap API',
    version: '1.0.0',
    description: 'Core StackMap ecosystem endpoints documented for internal use.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      FileContent: fileContentSchema,
      ErrorResponse: errorSchema,
    },
  },
  paths: {
    '/api/repos/{repoId}/files/content': {
      get: {
        tags: ['Repositories'],
        summary: 'Retrieve cached or freshly fetched file contents.',
        description: 'Enforces authentication, validates the repoId and path, and returns metadata + text. If the file is not cached, it fetches it from GitHub, stores it, and returns the refreshed record.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'repoId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Internal UUID (or DB id) of the repository.',
          },
          {
            name: 'path',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Repository-relative path to the desired file, url-encoded if it contains special characters.',
          },
        ],
        responses: {
          '200': {
            description: 'File retrieved successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FileContent' },
              },
            },
          },
          '400': {
            description: 'Validation failed (missing/invalid repoId or path).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Authentication required or token invalid/expired.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Repository or file could not be found.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Server error while refreshing the cache or fetching from GitHub.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};
