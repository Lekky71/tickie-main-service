import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { config } from '../constants/settings';
import { UnAuthorizedError } from '../interfaces';

const client = new OAuth2Client(config.google.clientID);

export async function verifyGoogleToken(token: string): Promise<TokenPayload> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientID
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnAuthorizedError();
    }
    return payload;
  } catch (err: any) {
    console.error(err);
    throw new UnAuthorizedError();
  }
}
