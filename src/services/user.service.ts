import { NotFoundError, User } from '../interfaces';
import { UserDb } from '../models';

export async function getMyProfile(userId: string): Promise<User> {
  const user = await UserDb.findById<User>(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}
