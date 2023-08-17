//@ts-ignore
import request from 'supertest';
import app from '../../app';
import { connectDBForTesting,dropAndDisconnectDBForTesting } from '../connect.db.for.testing';
//@ts-ignore
import randomstring from 'randomstring';
import { JwtHelper } from '../../helpers/jwt.helper';
import { UserAuthDb, UserDb } from '../../models';
import { JwtType} from '../../interfaces/user.verification';
import { staticUserAuthData, userData } from '../data/user';
import { faker } from '@faker-js/faker';



export const forgotPasswordE2E = () => {
  randomstring.generate = jest.fn().mockReturnValue(userData.otp);
  JwtHelper.prototype.generateToken = jest.fn().mockReturnValueOnce(userData.forgotPasswordAuthToken);

  beforeAll(async () => {
    await connectDBForTesting();
    await UserDb.create({ email: staticUserAuthData.email.toLowerCase(), fullName: staticUserAuthData.fullName });
    await UserAuthDb.create({email:staticUserAuthData.email.toLowerCase(),password:userData.password,recognisedDevices:['1234'],user:faker.string.uuid()});
    // await UserVerificationDb.create({email:staticUserAuthData.email,otp:userData.otp,deviceId:userData.deviceId,type:OtpType.FORGOT_PASSWORD,expiresAt:new Date(Date.now() + 10 * 60 * 1000)});
  });
  

  afterAll(async (done) => {
    await dropAndDisconnectDBForTesting();
    return done();
  });

  it('should request OTP with email', function(done) {
    request(app)
      .post('/user/auth/forgotpassword/otp-request')
      .set('x-device-id', userData.deviceId)
      .send({
        email: staticUserAuthData.email.toLowerCase(),
      })
      .expect(200, (err, res) => {
        if (err) {
            console.error(err);
            return done(err);
        }
        expect(res.body).toHaveProperty('message', 'Otp successfully sent');
        done();
      });
  });

  // test for non existing email
  it('should throw error if email does not exist', async done => {
    request(app)
      .post('/user/auth/forgotpassword/otp-request')
      .set('x-device-id', userData.deviceId)
      .send({
        email: userData.email,
      })
      .expect(400,(err ,res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('message', 'user with this email does not exist');
        done();
      });
  });

  it('Should verify OTP', async done => {
    request(app)
      .post('/user/auth/forgotpassword/otp-verify')
      .set('x-device-id', userData.deviceId)
      .send({
        email: staticUserAuthData.email,
        otp: userData.otp,
      })
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toBe(userData.forgotPasswordAuthToken);
        done();
      });
  });

  it('Should NOT verify OTP: Throw 400: Wrong OTP is sent', async done => {
    request(app)
      .post('/user/auth/forgotpassword/otp-verify')
      .set('x-device-id', userData.deviceId)
      .send({
        email: userData.email,
        otp: '012345',
      })
      .expect(400, (err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('message', 'Otp is invalid');
        done();
      });
  });

  it('should rest password new password', async done => {
    JwtHelper.prototype.verifyToken = jest.fn().mockReturnValue({
      email: staticUserAuthData.email,
      deviceId: '1234',
      type: JwtType.NEW_USER,
    });
    JwtHelper.prototype.generateToken = jest.fn().mockReturnValue(userData.authToken);
    request(app)
      .post('/user/auth/forgotpassword/password-reset')
      .set('x-device-id', '1234')
      .set('x-auth-token', userData.forgotPasswordAuthToken)
      .send({
        password: userData.password,
      })
      .expect(200, async (err: any, res: any) => {
        if (err) {console.log(err); return done(err);}
        // return done(err);
        expect(res.body).toHaveProperty('token', userData.authToken);
        done();
      });
  });
};


describe('FORGOT PASSWORD FLOW',forgotPasswordE2E);
