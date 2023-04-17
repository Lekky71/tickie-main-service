import mongoose from 'mongoose';
import { config } from '../constants/settings';

export async function connectMongo() {
  const connectionString = config.mongodb.uri;
  mongoose.connect(connectionString);
  mongoose.connection.on('connected', () => {
    console.info('Mongo Connection Established');
  });
  mongoose.connection.on('error', (err) => {
    console.error(`Mongo Connection Error : ${err}`);
    process.exit(1);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('Mongo Connection disconnected');
    process.exit(1);
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close(true);
      console.info('Mongoose default connection disconnected through app termination');
    } catch (err) {
      console.error('Could not close Mongoose Connection');
      console.error(err);
    }
    process.exit(0);
  });
}
