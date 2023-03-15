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
  process.on('SIGINT', () => {
    mongoose.connection.close(true).then(() => {
      console.info('Mongoose default connection disconnected through app termination');
      process.exit(0);
    })
      .catch((err) => {
        console.error('Could not close MongoDB Connection');
        console.error(err);
      });
  });
}
