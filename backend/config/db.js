// MONGODB  CONNECTION ************ */
import mongoose from 'mongoose'; 
export default async function connectDB  (attempts = 5)  {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Could not connect to MongoDB', err);
      if (attempts > 0) {
        console.log(`Retrying to connect... Attempts left: ${attempts - 1}`);
        setTimeout(() => connectDB(attempts - 1), 5000); 
      }
    }
  };