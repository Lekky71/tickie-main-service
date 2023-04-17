import { createClient } from "redis";
import { config } from "../constants/settings";

export const connectRedis = async () => {
  const client = createClient({
    url: config.redis.uri
  });

  client.on("error", err => console.log("Redis Client Error", err));

  await client.connect();
  return client;
};
