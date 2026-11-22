import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

// Reuse one client across hot reloads in development
export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(process.env.MONGODB_URI as string);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const db = mongoClient.db(process.env.DB_NAME || "wedplan");

// On serverless hosting an instance can be frozen and resumed, and the client's connection may be
// closed in between ("Topology is closed"). connect() returns at once when the client is healthy and
// opens a fresh connection on the same client when it is not, so call this before database work.
export const ensureConnected = async () => {
  await mongoClient.connect();
};
