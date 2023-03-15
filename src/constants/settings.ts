export const config = {
  mongodb: {
    uri: <string>process.env.MONGODB_URI,
    collections: {
      userVerifications: 'user_verifications',
      users: 'users',
      userAuth: 'user_auth_token',
    },
  },
};
