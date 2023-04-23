export interface JwtConfig {
  privateKey: string;
  handleJsonResponse?: Function;
  UserTokenDb: any;
  redisClient: any;
}
