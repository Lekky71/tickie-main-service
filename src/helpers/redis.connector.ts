import { createClient } from 'redis';
import { config } from '../constants/settings';

const client = createClient({
  url: config.redis.uri
});

export const connectRedis = async () => {
  client.on('error', err => console.log('Redis Client Error', err));
  await client.connect();
  const isConnected = client.isReady;
  if (isConnected) {
    console.info('Redis Connection Established');
  }
  return client;
};

export const redisClient = client;
