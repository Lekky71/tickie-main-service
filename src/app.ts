require('dotenv').config();

import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import methodOverride from 'method-override';
import * as swaggerUi from 'swagger-ui-express';
import ApiRoutes from './routes';

const swaggerSpec = require('./configuration/swagger');

const isProduction: boolean = process.env.NODE_ENV === 'production';

const app = express();

app.set('port', process.env.APP_PORT);
app.set('env', process.env.NODE_ENV);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  compression({
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
      }
      // fallback to standard filter function
      return compression.filter(req, res);
    }
  })
);

/**
 * Helmet for additional server security
 *  xssfilter, frameguard etc.
 *  https://www.npmjs.com/package/helmet
 */
app.use(helmet());

app.disable('x-powered-by');

app.use(methodOverride());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const router = express.Router();

router.use(ApiRoutes);

app.use(router);

// Force all requests on production to be served over https
app.use(function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https' && isProduction) {
    const secureUrl = 'https://' + req.hostname + req.originalUrl;
    res.redirect(302, secureUrl);
  }

  next();
});

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // handles all errors passed as argument to next() function
  return res.status(err.code || 500).json({
    message: err.message,
    errors: err.errors
  });
});

export default app;



