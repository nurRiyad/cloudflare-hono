import { Hono } from "hono";
import { getDB } from "../db";
import { usersTable } from "../schema";

export type Env = {
  DATABASE_URL: string;
};

export const auth = new Hono<{ Bindings: Env }>();

auth.get("/", (c) => {
  return c.json({ name: "Auth Route" });
});

auth.get("/users", async (c) => {
  try {
    const { db } = getDB(c.env.DATABASE_URL);
    const allUser = (await db.select().from(usersTable)) || [];
    return c.json(allUser);
  } catch (error) {
    return c.json({ msg: "Something went wrong" });
  }
});
