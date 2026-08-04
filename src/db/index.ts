 import { drizzle } from "drizzle-orm/node-postgres";
 import { Pool } from "pg";
 import * as schema from './schema';
 import { ENV } from "../config/env";

 if (!ENV.DB_URL) {
  throw new Error("DATABASE_URL is not set in env");
 }

// initialize PostgreSQL connection pool 
const pool = new Pool({ connectionString: ENV.DB_URL });

// logs when first connection is made
pool.on("connect", () => {
  console.log("Database connected successfully!");
});

// log when an error occurs
pool.on("error", (err) => {
  console.log("Database connection error:", err)
});

// "db" used for querying
export const db = drizzle({ client: pool, schema })


