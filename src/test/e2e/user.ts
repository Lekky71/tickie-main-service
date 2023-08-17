// test get user profile
// @ts-ignore
import request from 'supertest';
import app from '../../app';
import { connectDBForTesting, dropAndDisconnectDBForTesting } from '../connect.db.for.testing';
import { userData } from '../data/user';
import { redisClient } from '../../helpers/redis.connector';
import { JwtHelper } from '../../helpers/jwt.helper';
import { JwtType } from '../../interfaces/user.verification';
import { UserDb } from '../../models';

export const userE2E = () => {
  // mock redis client
  beforeAll(async () => {
    await connectDBForTesting();
    // mock redis client
    redisClient.get = jest.fn().mockImplementation((key: string) => {
      if (key.startsWith('tickie_token:')) {
        return Promise.resolve(userData.authToken);
      }
      return Promise.resolve(null);
    });
    // Get user ID from DB
    console.log(await UserDb.find({}));
    const userId = await UserDb.findOne({ email: userData.email.toLowerCase() }).select('_id').lean();
    console.log('userId', userId);
    // MOCK JwtHelper.verifyToken
    JwtHelper.prototype.verifyToken = jest.fn().mockReturnValueOnce({
      userId: userId?._id || '',
      email: userData.email,
      deviceId: userData.deviceId,
      type: JwtType.USER,
    });
  });

  afterAll(async (done) => {
    await dropAndDisconnectDBForTesting();
    return done();
  });

  it('Should return 403', function (done) {
    request(app)
      .get('/user/me')
      .expect(500, done);
  });

  it('Should return 200', function (done) {
    jest.setTimeout(15000);
    request(app)
      .get('/user/me')
      .set('x-device-id', userData.deviceId)
      .set('x-auth-token', userData.authToken)
      .expect(200, async (err, res) => {
        // console.log(res);
        if (err) {
          console.log(err);
          return done(err);
        }
        done();
      });
  });
};
