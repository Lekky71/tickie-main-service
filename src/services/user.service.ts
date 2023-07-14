import { BadRequestError, NotFoundError, User } from '../interfaces';
import { IUserAuth, UserAuthDb, UserDb, UserTokenDb } from '../models';
import { MulterS3File } from '../interfaces/multer.s3.file';

export async function getMyProfile(userId: string): Promise<User> {
  const user = await UserDb.findById<User>(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

export async function updateUserProfile(body: { userId: string; fullName?: string; avatarFile?: MulterS3File }): Promise<User> {
  const { userId, avatarFile } = body;
  const user = await UserDb.findById<User>(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (avatarFile) {

  }
  return user;
}

export async function managePassword(
  props: { userId: string, currentPassword: string, newPassword: string }): Promise<User> {
  const userAuth = await UserAuthDb.findOne<IUserAuth>({ user: props.userId });
  if (!userAuth) {
    throw new BadRequestError('there is an error with your login information');
  }

  /**
   * check if there is a user
   * verify current password
   * if the current password is incorrect, break code execution
   * true? set new password,
   * delete all token for the user
   * return user
   * */

  if (!userAuth.verifyPassword(props.currentPassword)) {
    throw new BadRequestError('current password is wrong');
  }

  userAuth.password = props.newPassword;
  /** validateModifiedOnly option to true for the plugin to run*/
  await userAuth.save({ validateModifiedOnly: true });

  await UserTokenDb.deleteOne({ user: props.userId });

  const user = await UserDb.findById<User>(props.userId);

  return user!;

}

