import { login } from '../../services/auth.service';
import { UserAuthDb, UserVerificationDb, UserTokenDb, UserDb } from '../../models';
import { BadRequestError } from '../../interfaces';
import { JwtHelper } from '../../helpers/jwt.helper';
import { generateOtp } from '../../helpers/Utils';
import { connectDBForTesting } from '../connect.db.for.testing';
import { userData } from '../data/user';


describe('login', () => {
     beforeAll(async () => {
    await connectDBForTesting();
  });
    // Unit test for successful login
    it('successfully logs in a user', async () => {
        // Mock input data
        const body = {
            email: userData.email,
            password: userData.password,
            deviceId: userData.deviceId
        };

        // Mock database response
        const existingUserAuth = {
            user: userData.user,
            recognisedDevices: [userData.deviceId],
            verifyPassword: jest.fn().mockResolvedValueOnce(true)
        };
        UserAuthDb.prototype.findOne= jest.fn().mockResolvedValueOnce(existingUserAuth);

        // Mock JWT token generation
        JwtHelper.prototype.generateToken = jest.fn().mockReturnValueOnce(userData.authToken);
      
        UserDb.prototype.findById=jest.fn().mockResolvedValueOnce(userData);

        // Act
        const result = await login(body);

        // Assertion
        expect(result).toEqual({
            token: userData.authToken,
            user: userData
        });
    });
    
    it('throws BadRequestError for incorrect password', async () => {
        const body = {
            email: userData.email,
            password: 'wrongpassword',
            deviceId: userData.deviceId
        };

        const existingUserAuth = {
            user: userData.user,
            recognisedDevices: [userData.deviceId],
            verifyPassword: jest.fn().mockResolvedValue(false) // Mock password verification failure
        };
        UserAuthDb.prototype.findOne=jest.fn().mockResolvedValue(existingUserAuth);

        await expect(login(body)).rejects.toThrow(BadRequestError);
    });

    // Unit test for device not recognized
    it('throws BadRequestError for unrecognized device', async () => {
        const body = {
            email: userData.email,
            password: userData.password,
            deviceId: '9iejjsks' //an unknown device ID 
        };

        const existingUserAuth = {
            user: userData.user,
            recognisedDevices: [userData.deviceId],
            verifyPassword: jest.fn().mockResolvedValue(true)
        };
        UserAuthDb.prototype.findOne= jest.fn().mockResolvedValue(existingUserAuth);

        await expect(login(body)).rejects.toThrow(BadRequestError);
    });
});
