import { NotFoundError, User } from '../interfaces';
import { UserDb } from '../models';
import { MulterS3File } from '../interfaces/multer.s3.file';

export async function getMyProfile(userId: string): Promise<User> {
  const user = await UserDb.findById<User>(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

export async function updateUserProfile(body: { userId: string; fullName?: string; avatarFile?: MulterS3File }): Promise<User> {
  const { userId, fullName, avatarFile } = body;
  const user = await UserDb.findById<User>(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (avatarFile) {

  }
  return user;
}
