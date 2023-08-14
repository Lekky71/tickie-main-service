import { generateOtp } from '../../helpers/Utils';
import { UserVerificationDb } from '../../models';
import { JwtHelper } from '../../helpers/jwt.helper';
import { verifySignupOtp } from '../../services/auth.service';

describe('Signup test suite', () => {
  it('OTP generation', () => {
    const otp = generateOtp();
    expect(otp).toHaveLength(6);
    // expect it to be numerical
    expect(parseInt(otp)).not.toBeNaN();
  });

  const token = 'token_bla_bla';
  const email = 'leke@gmail.com';
  const deviceId = 'device_id';
  const otp = '123456';

  // pass otp verification
  it('OTP verification', async () => {
    UserVerificationDb.findOne = jest.fn().mockResolvedValueOnce({
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      deleteOne: jest.fn(),
    });
    JwtHelper.prototype.generateToken = jest.fn().mockReturnValueOnce(token);

    const result = await verifySignupOtp({
      email,
      deviceId,
      otp,
    });
    expect(result).toBe(token);
  });
});
