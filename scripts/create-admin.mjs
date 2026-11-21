// Creates the admin account, or promotes an existing account to admin.
// Admins can never sign up through the website; this script is the only way.
// Run: npm run create-admin  (reads ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME from .env.local)
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const { MONGODB_URI, DB_NAME, BETTER_AUTH_URL, BETTER_AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const ADMIN_NAME = process.env.ADMIN_NAME || "WedPlan Admin";

if (!MONGODB_URI || !BETTER_AUTH_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set MONGODB_URI, BETTER_AUTH_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
const db = client.db(DB_NAME || "wedplan");
const users = db.collection("users");

const auth = betterAuth({
  baseURL: BETTER_AUTH_URL || "http://localhost:3000",
  secret: BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      subscriptionPlan: { type: "string", defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
      businessName: { type: "string", required: false, input: true },
    },
  },
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
});

try {
  await client.connect();
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await users.findOne({ email });

  if (!existing) {
    await auth.api.signUpEmail({ body: { name: ADMIN_NAME, email, password: ADMIN_PASSWORD } });
    console.log(`Created account ${email}`);
  }

  await users.updateOne({ email }, { $set: { role: "admin", isBlocked: false, businessName: null } });
  console.log(`${email} is now an admin.`);
} catch (error) {
  console.error("Could not create the admin:", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
