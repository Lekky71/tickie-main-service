// export interface MulterS3File extends Express.Multer.File{
export interface MulterS3File extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition?: string;
  contentEncoding?: string;
  storageClass: string;
  serverSideEncryption?: string;
  metadata: MulterS3FileMetadata;
  location: string;
  etag: string;
}

interface MulterS3FileMetadata {
  fieldName: string;
}
