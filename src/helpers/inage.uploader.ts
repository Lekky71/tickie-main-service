import * as aws from 'aws-sdk';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../constants/settings';
import { BadRequestError } from '../interfaces';
import { MulterS3File } from '../interfaces/multer.s3.file';
import { Buffer } from 'buffer';
import axios from 'axios';
import { ImageSize, resizeImage } from './image.resizer';
import path from 'path';

const multerS3 = require('multer-s3');
const heicConvert = require('heic-convert');

const awsConfig = config.aws;

aws.config.update({
  secretAccessKey: awsConfig.secretAccessKey,
  accessKeyId: awsConfig.accessKeyId,
  region: awsConfig.region,
});

const s3 = new aws.S3();


export const s3UploadOne = async (fileInfo: { mimetype?: string, originalName: string, name: string; buffer: Buffer }): Promise<string> => {
  const { mimetype, originalName, name, buffer } = fileInfo;
  const fileExtension = path.extname(fileInfo.name);
  const params = {
    Bucket: awsConfig.s3BucketName,
    ACL: 'public-read',
    Key: `tickie-user-avatars/${name}${fileExtension}`, // File name you want to save as in S3
    Body: buffer,
    ContentType: fileInfo.mimetype,
  };

  // Uploading files to the bucket
  const data = await s3.upload(params).promise();
  console.log(`File uploaded successfully at ${data.Location}`);
  return data.Location;
};


const fileFilter = (req: any, file: any, cb: Function) => {
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/heic' && file.mimetype !== 'image/heif') {
    cb(new BadRequestError('Invalid file type, only images are allowed'), false);
  } else if (file.size > 10485760) {
    cb(new BadRequestError('A single file cannot be larger than 10 MB'), false);
  } else {
    cb(null, true);
  }
};

const resizeAndUploadImageForAllSizes = async (file: MulterS3File) => {
  let fileBuffer = await fileToBuffer(file.location);
  // if the file is heic or heif, convert to png
  if (['image/heic', 'image/heif'].includes(file.mimetype)) {
    fileBuffer = await heicConvert({
      buffer: fileBuffer,
      format: 'PNG',
    });
  }
  // resize png to all 3 sizes
  let image64: string | undefined;
  let image256: string | undefined;
  let image512: string | undefined;

  const image64Buffer = await resizeImage(fileBuffer, ImageSize.IMAGE_64);
  //
  // upload to s3
  // return the s3 urls for these files

};

export const multerUpload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'tickie-staging-assets',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // @ts-ignore
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    // @ts-ignore
    key: function (req, file, cb) {
      cb(null, `multer-temp-files/${Date.now().toString()}_${uuidv4()}`);
    }
  }),
});

const fileToBuffer = async (url: string): Promise<Buffer> => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'utf-8');
}
