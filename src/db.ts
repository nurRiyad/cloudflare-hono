import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const getDB = (db_url: string) => {
  const sql = neon(db_url);
  const db = drizzle(sql);
  return { db };
};
