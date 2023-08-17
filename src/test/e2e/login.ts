// @ts-ignore
import request from 'supertest';

import app from '../../app';
import { connectDBForTesting } from '../connect.db.for.testing';
// @ts-ignore
import randomstring from 'randomstring';
import { JwtHelper } from '../../helpers/jwt.helper';
import { userData } from '../data/user';
import { BadRequestError } from '../../interfaces';



export const LoginE2E = () => {
  randomstring.generate = jest.fn().mockReturnValueOnce(userData.otp);
  JwtHelper.prototype.generateToken = jest.fn().mockReturnValueOnce(userData.signUpAuthToken);

  // mock redis client
  beforeAll(async () => {
    await connectDBForTesting();
  });

    it('login in a user with valid email and password', function (done) {
        const loginDetails = {
            email: userData.email,
            password: userData.password
        };
        const deviceId = userData.deviceId;
    request(app)
      .post('/user/auth/login')
      .set('x-device-id', deviceId)
      .send(loginDetails)
      .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body).toEqual({
            token: userData.authToken,
            user: userData
        });
        done();
      });
  });

    it('throws BadRequestError for incorrect password', async (done) => {
       const loginDetails = {
            email: userData.email,
            password: 'wrongPassword'// simulating wrong password
       };
        const deviceId = userData.deviceId;
    request(app)
      .post('/user/auth/login')
      .set('x-device-id', deviceId)
      .send(loginDetails)
      .expect(200, (err, res) => {
          if (err) { return done(err); }

        expect(res.body).rejects.toThrow(BadRequestError);
        done();
      });
  });

    it('throws BadRequestError for unrecognized device', async (done) => {
      const loginDetails = {
            email: userData.email,
            password: userData.password
      };
    const deviceId= 'lslsiiss';// giving it wrong user device Id
    request(app)
      .post('/user/auth/login')
      .set('x-device-id', deviceId)
      .send(loginDetails)
      .expect(400, (err, res) => {
          if (err) { return done(err); }
         expect(res.body).rejects.toThrow(BadRequestError);
        done();
      });
  });
};
