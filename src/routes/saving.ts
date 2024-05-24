import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { getDB } from "../db";
import { incomesTable, savingsTable } from "../schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export const saving = new Hono<{ Bindings: Env }>();

saving.get("/", async (c) => {
  try {
    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!id) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const saving = await db.query.savingsTable.findMany({
      where: eq(savingsTable.userId, id),
    });

    return c.json(saving);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});

saving.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { topic, amount } = body;

    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!topic || !amount || !id) {
      throw new HTTPException(400, { message: "Bad request topic and amount required" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const newSaving = { topic: topic, amount: amount, userId: id };
    const saving = await db.insert(savingsTable).values(newSaving).returning();

    return c.json(saving);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});
