import * as aws from 'aws-sdk';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../constants/settings';
import { BadRequestError } from '../interfaces';

const multerS3 = require('multer-s3');

const awsConfig = config.aws;

aws.config.update({
  secretAccessKey: awsConfig.secretAccessKey,
  accessKeyId: awsConfig.accessKeyId,
  region: awsConfig.region,
});

const s3 = new aws.S3();

const fileFilter = (req: any, file: any, cb: Function) => {
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/heic' && file.mimetype !== 'image/heif') {
    cb(new BadRequestError('Invalid file type, only images are allowed'), false);
  } else if (file.size > 10485760) {
    cb(new BadRequestError('A single file cannot be larger than 10 MB'), false);
  } else {
    cb(null, true);
  }
};

export const multerUpload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'gowagr-staging-assets',
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
