import { IExpressRequest } from '../interfaces';
import { Response as ExpressResponse } from 'express';
import * as userService from '../services/user.service';
import * as ResponseManager from '../helpers/response.manager';
import { MulterS3File } from '../interfaces/multer.s3.file';

export async function handleGetMyProfile(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  try {
    const userId = req.userId;
    const response = await userService.getMyProfile(userId!);
    ResponseManager.success(res, response);
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleUpdateUserProfile(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  try {
    const userId = req.userId;
    const avatarFile = req.file as unknown as MulterS3File;
    const { fullName } = req.body;

    const response = await userService.updateUserProfile({
      userId: userId!,
      fullName,
      avatarFile,
    });
    ResponseManager.success(res, response);
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
