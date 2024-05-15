import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({
  path: ".dev.vars"
})

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true
});