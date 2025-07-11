import mongoose from 'mongoose';

const uri: string | undefined = process.env.DB_URL;

mongoose.set('strictQuery', false);

async function connect(): Promise<void> {
  if (!uri) {
    throw new Error('DB_URL is not defined');
  }
  try {
    await mongoose.connect(uri);
  } catch (error) {
    throw error;
  }
}

export default connect;
