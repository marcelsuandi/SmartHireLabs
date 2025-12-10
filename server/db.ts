import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export function getDb() {
  const url = process.env.DATABASE_URL as string;
  const pool = new Pool({ connectionString: url });
  return drizzle(pool);
}
