import express from 'express';
import { routeError } from '../handlers';

import userRoutes from './user';
import { MainApiValidator } from '../middlewares/openapi.validator';

const router: express.Router = express.Router();

router.use('/', MainApiValidator);
router.use('/user', userRoutes);

router.use('/health', (req, res) => {
  res.send({ status: 'OK' });
});

router.use(routeError);

export default router;
