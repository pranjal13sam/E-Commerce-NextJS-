import mongoose from "mongoose";


//This code creates a single MongoDB connection and caches it globally so it’s reused instead of reconnecting every time.
const MONGODB_URL = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn; 
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL).then((mongoose) => {
      return mongoose;
    });
  }
    cached.conn = await cached.promise;
    return cached.conn;
};
