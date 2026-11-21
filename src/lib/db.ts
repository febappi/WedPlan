import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

// Reuse one client across hot reloads in development
export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(process.env.MONGODB_URI as string);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const db = mongoClient.db(process.env.DB_NAME || "wedplan");
