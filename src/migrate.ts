import { migrate } from "drizzle-orm/postgres-js/migrator";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({
  path: ".dev.vars",
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration Successful!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
