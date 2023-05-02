export const config = {
  jwtPrivateKey: <string>process.env.JWT_PRIVATE_KEY,
  mongodb: {
    uri: <string>process.env.MONGODB_URI,
    collections: {
      userVerifications: 'user_verifications',
      users: 'users',
      userAuthTokens: 'user_auth_tokens',
      userAuth: 'user_auths'
    }
  },
  google: {
    clientID: <string>process.env.GOOGLE_CLIENT_ID
  },
  redis: {
    uri: <string>process.env.REDIS_URI
  },
  aws: {
    secretAccessKey: <string>process.env.AWS_SECRET_KEY,
    accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
    region: <string>process.env.AWS_REGION,
    s3BucketName: <string>process.env.AWS_S3_BUCKET,
  }
};
