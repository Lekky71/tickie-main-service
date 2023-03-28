export const config = {
  mongodb: {
    uri: <string> process.env.MONGODB_URI,
    collections: {
      userVerifications: 'user_verifications',
      users: 'users',
      userAuthTokens:'user_auth_tokens',
      userAuth:'user_auths'
    },
  },
};
