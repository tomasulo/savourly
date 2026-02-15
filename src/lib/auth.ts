import { betterAuth } from "better-auth";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:savourly.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const auth = betterAuth({
  database: {
    client,
    type: "sqlite",
  },
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
