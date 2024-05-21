import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const getDB = (db_url: string) => {
  const client = neon(db_url);
  const db = drizzle(client, { schema, logger: false });
  return { db };
};
