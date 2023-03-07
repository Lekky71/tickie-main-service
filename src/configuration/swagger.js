const swaggerJSDoc = require('swagger-jsdoc');

// options for the swagger docs
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tickie API Docs', // Title of the documentation
      version: '1.0.0', // Version of the app
      description: 'Docs',
    },
  },
  // swaggerDefinition,
  apis: ['./spec/api.yaml'],
};

// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);
