import { faker } from '@faker-js/faker';

export const userData = {
  user: faker.string.uuid(),
  email: faker.internet.email(),
  deviceId: faker.string.uuid(),
  fullName: faker.internet.displayName(),
  password: 'Janetdoesnotloveyou234$',
  otp: faker.string.numeric(6),
  signUpAuthToken: faker.string.alphanumeric(32),
  authToken: faker.string.alphanumeric(32),
};
