import fs from 'fs';
import * as OpenApiValidator from 'express-openapi-validator';

const specPath = './spec/api.yaml';

if (!fs.existsSync('./spec/api.yaml')) {
  throw new Error('API spec path is not valid');
}

export const MainApiValidator = OpenApiValidator.middleware({
  apiSpec: specPath,
  validateRequests: true,
  validateResponses: false,
  validateSecurity: false,
  ignoreUndocumented: true,
  fileUploader: false,
  formats: [
    {
      name: 'bytes',
      type: 'string',
      validate: (a: any) => {
        return Buffer.from(a, 'base64').length > 0;
      }
    }
  ]
});
